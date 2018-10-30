char* matrix(char* ori, int bufSize) {
  for (int i = 0;i < bufSize;++ i)
    ori[i] <<= 1;
  return ori;
}

int main() {
  return 0;
}
