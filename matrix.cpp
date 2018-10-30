const int SIZE = 100;
int buffer[SIZE];
int* matrix() {
  for (int i = 0;i < SIZE;++ i)
    buffer[i] <<= 1;
  return buffer;
}

int getBuffer() {
  return (int)&buffer[0];
}

int main() {
  return 0;
}
