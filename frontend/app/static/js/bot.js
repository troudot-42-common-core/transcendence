// const availableDist = (x, y, vx, vy) => {
//     return (vy < 0) ? x : GAME.size.height - y;
// };
//
// const predictPosition = (x, y, vx, vy) => {
//     let dist = x / Math.abs(vx) * Math.abs(vy);
//     let tmpVy = vy;
//
//     if (dist > availableDist(x, y, vx, vy)) {
//         dist -= availableDist(x, y, vx, vy);
//         tmpVy *= -1;
//         while (dist > GAME.size.height) {
//             dist -= GAME.size.height;
//             tmpVy *= -1;
//         }
//     }
//     if (tmpVy < 0) {
//         return GAME.size.height - dist - GAME.ball.height;
//     } else {
//         return dist;
//     }
// };
