//how to get evenly spaced x co-ordinate values
//at which to paint lane markers and things like that
function lerp(A, B, t) {
   return A + (B - A) * t;
}


//using two line segments,
//one drawn from coordinate point A to B,
//another drawn from coordinate point C to D,
//return the X, Y coorinate of any intersection,
//as well as the offset of that intersection from the starting point of A
//so that it can be used like an offset from a sensor starting point

//more explanation of this function can be seen here:
// https://www.youtube.com/watch?v=fHOLQJo0FjQ

function getIntersection(A, B, C, D) {

   const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);

   const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);

   const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

   if (bottom != 0) {

      const t = tTop / bottom;
      const u = uTop / bottom;

      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
         return {
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
            offset: t
         }
      }

   }

   return null;
}