# v0.6.5 same-host baseline

| workload | samples | p50 | p95 | p99 | mean | p50 throughput |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| arm single | 25 | 69.144 ms | 228.236 ms | 304.125 ms | 97.072 ms | 14.463 candidates/s |
| arm population ×12 | 25 | 1,367.805 ms | 6,232.609 ms | 12,070.658 ms | 2,176.661 ms | 8.773 candidates/s |
| G1 single | 25 | 183.362 ms | 446.103 ms | 517.042 ms | 213.270 ms | 5.454 candidates/s |
| G1 population ×16 | 25 | 2,740.526 ms | 6,149.719 ms | 6,782.367 ms | 2,932.960 ms | 5.838 candidates/s |

The population boundary is sequential in v0.6.5. Large p95/p99 inflation is therefore visible directly to the interactive optimizer, especially for a full generation.

Packet sizes at the baseline were arm admission/evaluate/trace = 37/19/8,127 doubles and G1 admission/evaluate/trace = 15/23/7,039 doubles.
