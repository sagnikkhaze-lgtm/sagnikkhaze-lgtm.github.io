# Practical C: Dealing with Heap Allocations and Terminal Buffers

Working close to the metal in C means you don't get the safety net of garbage collection. If you mess up pointer hygiene or forget to clear stdin, your app either segfaults or acts weirdly on user input. Here are two patterns I stick to when building CLI utilities.

---

## 1. Safe Heap Allocation & Pointer Cleanup

Unchecked `malloc` returns can blow up your program if memory runs out. I always wrap heap allocations and explicitly set freed pointers back to `NULL` to catch accidental reuse:

```c
#include <stdio.h>
#include <stdlib.h>

int *init_buffer(size_t size) {
    int *buf = malloc(size * sizeof(int));
    if (!buf) {
        perror("Allocation failed");
        return NULL;
    }
    return buf;
}

void cleanup(int **buf) {
    if (buf && *buf) {
        free(*buf);
        *buf = NULL; // Zero out the pointer
    }
}
```

---

## 2. Cleaning up `fgets` Trailing Newlines

`scanf("%c")` often leaves trailing `\n` characters in the input stream, causing subsequent prompts to be skipped. Using `fgets()` and trimming the newline directly keeps input handling predictable:

```c
char input[128];
if (fgets(input, sizeof(input), stdin)) {
    input[strcspn(input, "\n")] = '\0'; // Clean newline
}
```

---

## Conclusion

Writing clean C takes extra care, but the speed and small binary footprint make it completely worth it.
