#include <stdio.h>
const int SIZE = 65535;
float buffer[SIZE], opMatrix[16], res[SIZE];

void matMulVec(const int matID, const int matSize, const int opSize) {
  /**
   * handle mat mul vector
   * only support length of 3 and 4 for efficiency
   * other length can also be supported but maybe not efficient
   */
  int cnt = 0;
  for (int i = 0;i < matSize;) {
    for (int j = 0;j < opSize;++ j, ++ i) 
      res[cnt] += buffer[i] * opMatrix[j];
    ++ cnt;
  }
}

float* matMulMat(const int matID, const int matSize, const int opSize) {
  /**
   * handle mat mul mat
   * only support length of 9 and 16 for efficency
   * other length can also be supported but maybe not efficient
   */

}

float* matMul(const int matID, const int matSize, const int opSize) {
  /**
   * handle all the mat Mul functions
   * give task to subfunctions based on opSize
   * the mul is the result of buffer ID and opMatrix
   * return the mul result
   */
  if (9 == opSize || 16 == opSize) matMulMat(matID, matSize, opSize);
  else matMulVec(matID, matSize, opSize);
}

float* getBuffer() {
  return (&buffer[0]);
}
float* getOpMatrix() {
  return (&opMatrix[0]);
}

int main() {
  matMulVec(0, 16, 4);
  return 0;
}
