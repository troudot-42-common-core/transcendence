#!/bin/bash

until curl -s http://elasticsearch:9200 >/dev/null; do
    sleep 1
done

curl -X PUT "http://elasticsearch:9200/_ilm/policy/ft_transcendence_policy" -H 'Content-Type: application/json' -d'
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_size": "5GB",
            "max_age": "1d"
          }
        }
      },
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
'

curl -X PUT "http://elasticsearch:9200/_template/ft_transcendence_template" -H 'Content-Type: application/json' -d'
{
  "index_patterns": ["ft_transcendence-*"],
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1,
    "index.lifecycle.name": "ft_transcendence_policy",
    "index.lifecycle.rollover_alias": "ft_transcendence"
  }
}
'

curl -X PUT "http://elasticsearch:9200/%3Cft_transcendence-%7Bnow%2Fd%7D-000001%3E" -H 'Content-Type: application/json' -d'
{
  "aliases": {
    "ft_transcendence": {
      "is_write_index": true
    }
  }
}
'
