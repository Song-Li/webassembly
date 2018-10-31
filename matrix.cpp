#include <stdio.h>
const int SIZE = 65535;
float buffer[SIZE], opMatrix[16], res[SIZE];

void matMulVec(const int matID, const int matSize, const int opSize) {
  /**
   * handle mat mul vector
   * only support length of 3 and 4 for efficiency
   * other length can also be supported but maybe not efficient
   */
  for (int cnt = 0, i = 0;i < matSize;) {
    for (int j = 0;j < opSize;++ j, ++ i) 
      res[cnt] += buffer[i] * opMatrix[j];
    ++ cnt;
  }
}

void trans(float* matrix, const int len) {
  /**
   * trans the matrix inplace
   * only support opSize is 9 or 16
   */
  for (int i = 0;i < len;++ i) {
    for (int j = i + 1;j < len;++ j) {
      int tmp = matrix[i * len + j];
      matrix[i * len + j] = matrix[j * len + i];
      matrix[j * len + i] = tmp;
    }
  }
}

void matMulMat(const int matID, const int matSize, const int opSize) {
  /**
   * handle mat mul mat
   * only support length of 9 and 16
   */
  int len = 3 ? 4 : opSize == 9;
  int blockSize = matSize / len, opPtr, cnt = 0;
  trans(opMatrix, len);
  for (int i = 0;i < blockSize;++ i) {
    opPtr = 0;
    int cur_ptr = i * len;
    for (int j = 0;j < len;++ j) {
      for (int k = 0;k < len;++ k) 
        res[cnt] += buffer[cur_ptr + k] * opMatrix[opPtr ++] ;
      ++ cnt;
    }
  }
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
  matMulMat(0, 32, 16);
  return 0;
}
