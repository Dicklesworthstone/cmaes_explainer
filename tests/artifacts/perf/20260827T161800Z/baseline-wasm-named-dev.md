# CPU Profile

| Duration | Samples | Interval | Functions |
|----------|---------|----------|----------|
| 3.46s | 2294 | 1.0ms | 250 |

**Top 10:** `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` 17.9%, `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` 9.4%, `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::grisu::format_shortest_opt]` 7.6%, `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` 4.7%, `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` 4.3%, `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` 4.1%, `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` 2.7%, `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` 2.6%, `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}]` 2.0%, `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` 1.9%

## Hot Functions (Self Time)

| Self% | Self | Total% | Total | Function | Location |
|------:|-----:|-------:|------:|----------|----------|
| 17.9% | 622.7ms | 17.9% | 622.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` | `[native code]` |
| 9.4% | 327.6ms | 58.1% | 2.01s | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` | `[native code]` |
| 7.6% | 263.2ms | 7.6% | 263.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::grisu::format_shortest_opt]` | `[native code]` |
| 4.7% | 166.0ms | 7.6% | 265.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` | `[native code]` |
| 4.3% | 151.0ms | 4.3% | 151.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` | `[native code]` |
| 4.1% | 143.0ms | 4.1% | 143.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 2.7% | 94.2ms | 30.2% | 1.04s | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` | `[native code]` |
| 2.6% | 91.1ms | 5.2% | 182.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` | `[native code]` |
| 2.0% | 70.2ms | 8.3% | 289.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}]` | `[native code]` |
| 1.9% | 69.1ms | 21.3% | 737.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` | `[native code]` |
| 1.9% | 67.1ms | 6.3% | 219.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 1.9% | 67.1ms | 18.0% | 623.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]` | `[native code]` |
| 1.9% | 66.0ms | 99.4% | 3.44s | `(unknown)` | `[native code]` |
| 1.8% | 63.0ms | 1.9% | 65.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` | `[native code]` |
| 1.4% | 49.5ms | 1.4% | 49.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}]` | `[native code]` |
| 1.3% | 47.5ms | 1.6% | 57.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]` | `[native code]` |
| 1.3% | 45.0ms | 8.5% | 296.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` | `[native code]` |
| 1.2% | 43.6ms | 1.8% | 63.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::evaluate]` | `[native code]` |
| 1.1% | 40.3ms | 1.1% | 40.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[4]]` | `[native code]` |
| 1.1% | 39.4ms | 1.8% | 63.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` | `[native code]` |
| 1.1% | 38.0ms | 2.5% | 88.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` | `[native code]` |
| 1.0% | 35.6ms | 1.0% | 35.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory]` | `[native code]` |
| 1.0% | 35.4ms | 1.7% | 61.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` | `[native code]` |
| 0.9% | 34.3ms | 3.0% | 105.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` | `[native code]` |
| 0.9% | 33.3ms | 1.0% | 36.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` | `[native code]` |
| 0.9% | 31.2ms | 0.9% | 31.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::rebuild_c]` | `[native code]` |
| 0.8% | 29.7ms | 0.8% | 29.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory[1]]` | `[native code]` |
| 0.8% | 28.3ms | 0.8% | 28.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.7% | 26.7ms | 5.5% | 191.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` | `[native code]` |
| 0.7% | 26.3ms | 13.3% | 463.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` | `[native code]` |
| 0.7% | 26.3ms | 0.7% | 26.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` | `[native code]` |
| 0.6% | 24.0ms | 0.8% | 30.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix]` | `[native code]` |
| 0.6% | 23.8ms | 19.3% | 668.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format::format_inner]` | `[native code]` |
| 0.6% | 22.3ms | 18.7% | 650.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` | `[native code]` |
| 0.6% | 20.9ms | 0.6% | 20.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::raw::from_raw_parts::precondition_check]` | `[native code]` |
| 0.5% | 20.1ms | 0.5% | 20.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::pow::pow]` | `[native code]` |
| 0.5% | 18.0ms | 0.5% | 18.0ms | `decode` | `[native code]` |
| 0.4% | 16.7ms | 0.4% | 16.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 0.4% | 16.3ms | 1.1% | 38.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow]` | `[native code]` |
| 0.4% | 15.9ms | 1.4% | 50.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]` | `[native code]` |
| 0.4% | 15.8ms | 10.1% | 349.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.4% | 14.0ms | 8.1% | 281.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad_formatted_parts]` | `[native code]` |
| 0.3% | 13.1ms | 0.5% | 18.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_dealloc]` | `[native code]` |
| 0.3% | 12.3ms | 10.4% | 362.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>]` | `[native code]` |
| 0.3% | 11.5ms | 3.0% | 104.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` | `[native code]` |
| 0.3% | 11.3ms | 0.6% | 22.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]` | `[native code]` |
| 0.3% | 10.9ms | 0.3% | 10.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index_mut]` | `[native code]` |
| 0.3% | 10.7ms | 1.4% | 49.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::grow_amortized]` | `[native code]` |
| 0.3% | 10.5ms | 0.3% | 12.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::dragon::format_shortest]` | `[native code]` |
| 0.2% | 10.3ms | 0.2% | 10.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::char::methods::encode_utf8_raw_unchecked]` | `[native code]` |
| 0.2% | 10.3ms | 11.5% | 399.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec]` | `[native code]` |
| 0.2% | 8.9ms | 0.2% | 8.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.2% | 8.9ms | 2.5% | 88.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]` | `[native code]` |
| 0.2% | 8.7ms | 0.6% | 21.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.2% | 8.7ms | 0.3% | 12.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[3]]` | `[native code]` |
| 0.2% | 8.5ms | 0.3% | 11.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked[1]]` | `[native code]` |
| 0.2% | 8.3ms | 0.2% | 8.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::ChunksMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.2% | 8.2ms | 4.0% | 141.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` | `[native code]` |
| 0.2% | 8.2ms | 0.2% | 8.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}]` | `[native code]` |
| 0.2% | 7.7ms | 0.2% | 7.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}]` | `[native code]` |
| 0.2% | 7.7ms | 0.2% | 7.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check]` | `[native code]` |
| 0.2% | 7.4ms | 0.7% | 25.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` | `[native code]` |
| 0.2% | 7.3ms | 0.2% | 7.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` | `[native code]` |
| 0.1% | 6.3ms | 0.2% | 8.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[1]]` | `[native code]` |
| 0.1% | 6.2ms | 0.4% | 15.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.1% | 5.9ms | 0.1% | 5.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::slice::index::SliceIndex<[f64]>>::index]` | `[native code]` |
| 0.1% | 5.8ms | 0.1% | 5.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::abs[1]]` | `[native code]` |
| 0.1% | 5.7ms | 5.1% | 176.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` | `[native code]` |
| 0.1% | 5.5ms | 0.1% | 5.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter[1]]` | `[native code]` |
| 0.1% | 5.2ms | 0.2% | 8.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::copy_from_slice_impl::<f64>]` | `[native code]` |
| 0.1% | 5.0ms | 0.1% | 5.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<usize>>::index_mut]` | `[native code]` |
| 0.1% | 4.7ms | 0.1% | 4.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[1]]` | `[native code]` |
| 0.1% | 4.6ms | 11.2% | 389.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>>::from_iter]` | `[native code]` |
| 0.1% | 4.5ms | 0.2% | 9.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.1% | 4.5ms | 0.8% | 28.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::reduce_pio2]` | `[native code]` |
| 0.1% | 4.3ms | 0.1% | 4.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}]` | `[native code]` |
| 0.1% | 4.2ms | 0.7% | 26.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` | `[native code]` |
| 0.0% | 3.3ms | 2.9% | 102.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` | `[native code]` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::unlink_chunk]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::hint::assert_unchecked::precondition_check[4]]` | `[native code]` |
| 0.0% | 3.1ms | 1.2% | 43.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` | `[native code]` |
| 0.0% | 3.0ms | 1.4% | 48.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.0% | 3.0ms | 0.1% | 4.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter[1]]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 2.8ms | 0.8% | 27.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow[4]]` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter]` | `[native code]` |
| 0.0% | 2.8ms | 0.1% | 4.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::stable::merge::MergeState<usize>>::merge_down::<<[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::max[1]]` | `[native code]` |
| 0.0% | 2.6ms | 0.1% | 4.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::shared::smallsort::CopyOnDrop<usize> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 0.0% | 2.5ms | 0.3% | 12.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<&alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter]` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.7ms | 0.1% | 5.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` | `[native code]` |
| 0.0% | 1.6ms | 0.2% | 9.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::reserve]` | `[native code]` |
| 0.0% | 1.6ms | 1.1% | 40.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` | `[native code]` |
| 0.0% | 1.6ms | 0.2% | 9.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::map::<f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 3.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` | `[native code]` |
| 0.0% | 1.5ms | 0.3% | 13.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as alloc[979189866cb66e31]::vec::spec_from_elem::SpecFromElem>::from_elem::<alloc[979189866cb66e31]::alloc::Global>]` | `[native code]` |
| 0.0% | 1.5ms | 0.6% | 22.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::insert_large_chunk]` | `[native code]` |
| 0.0% | 1.5ms | 0.1% | 4.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::num::imp::bignum::Big32x40>::mul_pow2]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate::<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[2]]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::take::Take<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.4ms | 1.5% | 54.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::driftsort_main::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}, alloc[979189866cb66e31]::vec::Vec<usize>>]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call::<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}]` | `[native code]` |
| 0.0% | 1.4ms | 1.3% | 45.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` | `[native code]` |
| 0.0% | 1.3ms | 0.1% | 4.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add]` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::sys::System as dlmalloc[5db836cf0c58e369]::Allocator>::alloc]` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::chunks_mut]` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 2.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::admit_jacobi_eigh]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<u32 as core[9097705de7cf5a87]::fmt::Display>::fmt]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::to_bits]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::set_len_on_drop::SetLenOnDrop>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<usize>>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize>::checked_mul]` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |

## Call Tree (Total Time)

| Total% | Total | Self% | Self | Function | Location |
|-------:|------:|------:|-----:|----------|----------|
| 100.0% | 3.46s | 0.0% | 0us | `(module)` | `/Users/jemanuel/projects/cmaes_explainer/[stdin]:5` |
| 99.4% | 3.44s | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/Library/Caches/codex-wasm-build/fs-cmaes-viz-wasm-dev-20260827T1621Z/fs_cmaes_viz_wasm.js:57` |
| 99.4% | 3.44s | 1.9% | 66.0ms | `(unknown)` | `[native code]` |
| 97.5% | 3.37s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run_json]` | `[native code]` |
| 97.5% | 3.37s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run multivalue shim]` | `[native code]` |
| 97.5% | 3.37s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::cmaes_viz_run]` | `[native code]` |
| 97.5% | 3.37s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run]` | `[native code]` |
| 97.5% | 3.37s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[wasm_bindgen[928881921d014e43]::__rt::maybe_catch_unwind::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}, alloc[979189866cb66e31]::string::String>]` | `[native code]` |
| 97.5% | 3.37s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}]` | `[native code]` |
| 58.1% | 2.01s | 9.4% | 327.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` | `[native code]` |
| 39.1% | 1.35s | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` | `[native code]` |
| 30.2% | 1.04s | 2.7% | 94.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` | `[native code]` |
| 21.3% | 737.3ms | 1.9% | 69.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` | `[native code]` |
| 19.3% | 668.1ms | 0.6% | 23.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format::format_inner]` | `[native code]` |
| 18.7% | 650.4ms | 0.6% | 22.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` | `[native code]` |
| 18.0% | 623.6ms | 1.9% | 67.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]` | `[native code]` |
| 17.9% | 622.7ms | 17.9% | 622.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` | `[native code]` |
| 13.3% | 463.6ms | 0.7% | 26.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` | `[native code]` |
| 11.5% | 399.4ms | 0.2% | 10.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec]` | `[native code]` |
| 11.2% | 389.1ms | 0.1% | 4.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>>::from_iter]` | `[native code]` |
| 10.4% | 362.0ms | 0.3% | 12.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>]` | `[native code]` |
| 10.1% | 349.7ms | 0.4% | 15.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 8.5% | 296.5ms | 1.3% | 45.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` | `[native code]` |
| 8.3% | 289.5ms | 2.0% | 70.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}]` | `[native code]` |
| 8.1% | 281.2ms | 0.4% | 14.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad_formatted_parts]` | `[native code]` |
| 7.6% | 265.6ms | 4.7% | 166.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` | `[native code]` |
| 7.6% | 263.2ms | 7.6% | 263.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::grisu::format_shortest_opt]` | `[native code]` |
| 6.3% | 219.3ms | 1.9% | 67.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 5.5% | 191.9ms | 0.7% | 26.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` | `[native code]` |
| 5.2% | 182.8ms | 2.6% | 91.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` | `[native code]` |
| 5.1% | 176.8ms | 0.1% | 5.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` | `[native code]` |
| 4.3% | 151.0ms | 4.3% | 151.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` | `[native code]` |
| 4.2% | 146.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]` | `[native code]` |
| 4.1% | 143.0ms | 4.1% | 143.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 4.0% | 141.4ms | 0.2% | 8.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` | `[native code]` |
| 3.0% | 105.7ms | 0.9% | 34.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` | `[native code]` |
| 3.0% | 104.5ms | 0.3% | 11.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` | `[native code]` |
| 2.9% | 102.5ms | 0.0% | 3.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` | `[native code]` |
| 2.5% | 88.8ms | 1.1% | 38.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` | `[native code]` |
| 2.5% | 88.0ms | 0.2% | 8.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]` | `[native code]` |
| 2.4% | 84.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` | `[native code]` |
| 1.9% | 65.9ms | 1.8% | 63.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` | `[native code]` |
| 1.8% | 63.7ms | 1.2% | 43.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::evaluate]` | `[native code]` |
| 1.8% | 63.3ms | 1.1% | 39.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` | `[native code]` |
| 1.7% | 61.8ms | 1.0% | 35.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` | `[native code]` |
| 1.6% | 57.8ms | 1.3% | 47.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]` | `[native code]` |
| 1.5% | 54.8ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::driftsort_main::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}, alloc[979189866cb66e31]::vec::Vec<usize>>]` | `[native code]` |
| 1.5% | 54.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>]` | `[native code]` |
| 1.5% | 53.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::sort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 1.4% | 50.3ms | 0.4% | 15.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]` | `[native code]` |
| 1.4% | 49.5ms | 1.4% | 49.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}]` | `[native code]` |
| 1.4% | 49.4ms | 0.3% | 10.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::grow_amortized]` | `[native code]` |
| 1.4% | 48.9ms | 0.0% | 3.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 1.4% | 48.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::create_run::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 1.4% | 48.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::quicksort::quicksort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 1.3% | 46.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` | `[native code]` |
| 1.3% | 45.1ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` | `[native code]` |
| 1.2% | 43.3ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` | `[native code]` |
| 1.1% | 40.3ms | 1.1% | 40.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[4]]` | `[native code]` |
| 1.1% | 40.2ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` | `[native code]` |
| 1.1% | 38.7ms | 0.4% | 16.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow]` | `[native code]` |
| 1.0% | 36.6ms | 0.9% | 33.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` | `[native code]` |
| 1.0% | 35.6ms | 1.0% | 35.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory]` | `[native code]` |
| 0.9% | 33.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner<_>>::reserve::do_reserve_and_handle::<alloc[979189866cb66e31]::alloc::Global>]` | `[native code]` |
| 0.9% | 31.2ms | 0.9% | 31.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::rebuild_c]` | `[native code]` |
| 0.8% | 30.9ms | 0.6% | 24.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix]` | `[native code]` |
| 0.8% | 29.7ms | 0.8% | 29.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory[1]]` | `[native code]` |
| 0.8% | 28.3ms | 0.8% | 28.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.8% | 28.0ms | 0.1% | 4.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::reduce_pio2]` | `[native code]` |
| 0.8% | 27.8ms | 0.0% | 2.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow[4]]` | `[native code]` |
| 0.7% | 26.5ms | 0.1% | 4.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` | `[native code]` |
| 0.7% | 26.3ms | 0.7% | 26.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` | `[native code]` |
| 0.7% | 25.8ms | 0.2% | 7.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` | `[native code]` |
| 0.6% | 22.3ms | 0.3% | 11.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]` | `[native code]` |
| 0.6% | 22.3ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.6% | 21.5ms | 0.2% | 8.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.6% | 20.9ms | 0.6% | 20.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::raw::from_raw_parts::precondition_check]` | `[native code]` |
| 0.5% | 20.7ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.5% | 20.1ms | 0.5% | 20.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::pow::pow]` | `[native code]` |
| 0.5% | 19.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 0.5% | 18.7ms | 0.3% | 13.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_dealloc]` | `[native code]` |
| 0.5% | 18.0ms | 0.5% | 18.0ms | `decode` | `[native code]` |
| 0.5% | 18.0ms | 0.0% | 0us | `cmaes_viz_run` | `/Users/jemanuel/Library/Caches/codex-wasm-build/fs-cmaes-viz-wasm-dev-20260827T1621Z/fs_cmaes_viz_wasm.js:60` |
| 0.4% | 16.7ms | 0.4% | 16.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 0.4% | 15.2ms | 0.1% | 6.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.3% | 13.6ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as alloc[979189866cb66e31]::vec::spec_from_elem::SpecFromElem>::from_elem::<alloc[979189866cb66e31]::alloc::Global>]` | `[native code]` |
| 0.3% | 13.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::vec::from_elem::<f64>]` | `[native code]` |
| 0.3% | 12.2ms | 0.0% | 2.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]` | `[native code]` |
| 0.3% | 12.0ms | 0.2% | 8.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[3]]` | `[native code]` |
| 0.3% | 12.0ms | 0.3% | 10.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::dragon::format_shortest]` | `[native code]` |
| 0.3% | 11.8ms | 0.2% | 8.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked[1]]` | `[native code]` |
| 0.3% | 10.9ms | 0.3% | 10.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index_mut]` | `[native code]` |
| 0.2% | 10.3ms | 0.2% | 10.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::char::methods::encode_utf8_raw_unchecked]` | `[native code]` |
| 0.2% | 9.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>]` | `[native code]` |
| 0.2% | 9.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::VizRun>]` | `[native code]` |
| 0.2% | 9.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 0.2% | 9.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>>]` | `[native code]` |
| 0.2% | 9.2ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` | `[native code]` |
| 0.2% | 9.1ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` | `[native code]` |
| 0.2% | 9.1ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>]` | `[native code]` |
| 0.2% | 9.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]` | `[native code]` |
| 0.2% | 9.0ms | 0.1% | 4.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.2% | 8.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::clone::Clone>::clone]` | `[native code]` |
| 0.2% | 8.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` | `[native code]` |
| 0.2% | 8.9ms | 0.1% | 6.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[1]]` | `[native code]` |
| 0.2% | 8.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>]` | `[native code]` |
| 0.2% | 8.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` | `[native code]` |
| 0.2% | 8.9ms | 0.2% | 8.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.2% | 8.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` | `[native code]` |
| 0.2% | 8.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` | `[native code]` |
| 0.2% | 8.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` | `[native code]` |
| 0.2% | 8.3ms | 0.2% | 8.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::ChunksMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.2% | 8.2ms | 0.2% | 8.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}]` | `[native code]` |
| 0.2% | 8.2ms | 0.1% | 5.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::copy_from_slice_impl::<f64>]` | `[native code]` |
| 0.2% | 7.7ms | 0.2% | 7.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}]` | `[native code]` |
| 0.2% | 7.7ms | 0.2% | 7.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check]` | `[native code]` |
| 0.2% | 7.3ms | 0.2% | 7.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` | `[native code]` |
| 0.1% | 6.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort8_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.1% | 6.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_alloc]` | `[native code]` |
| 0.1% | 5.9ms | 0.1% | 5.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::slice::index::SliceIndex<[f64]>>::index]` | `[native code]` |
| 0.1% | 5.8ms | 0.1% | 5.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::abs[1]]` | `[native code]` |
| 0.1% | 5.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` | `[native code]` |
| 0.1% | 5.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<usize>>]` | `[native code]` |
| 0.1% | 5.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` | `[native code]` |
| 0.1% | 5.6ms | 0.0% | 1.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` | `[native code]` |
| 0.1% | 5.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::exp]` | `[native code]` |
| 0.1% | 5.5ms | 0.1% | 5.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter[1]]` | `[native code]` |
| 0.1% | 5.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::expm1_core]` | `[native code]` |
| 0.1% | 5.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.1% | 5.0ms | 0.1% | 5.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<usize>>::index_mut]` | `[native code]` |
| 0.1% | 4.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::raw_vec::RawVec<u8>>]` | `[native code]` |
| 0.1% | 4.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` | `[native code]` |
| 0.1% | 4.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` | `[native code]` |
| 0.1% | 4.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.1% | 4.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` | `[native code]` |
| 0.1% | 4.7ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String as core[9097705de7cf5a87]::convert::From<&str>>::from]` | `[native code]` |
| 0.1% | 4.7ms | 0.1% | 4.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[1]]` | `[native code]` |
| 0.1% | 4.6ms | 0.0% | 3.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` | `[native code]` |
| 0.1% | 4.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` | `[native code]` |
| 0.1% | 4.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` | `[native code]` |
| 0.1% | 4.4ms | 0.0% | 1.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add]` | `[native code]` |
| 0.1% | 4.4ms | 0.0% | 2.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::stable::merge::MergeState<usize>>::merge_down::<<[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` | `[native code]` |
| 0.1% | 4.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>]` | `[native code]` |
| 0.1% | 4.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.1% | 4.4ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` | `[native code]` |
| 0.1% | 4.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` | `[native code]` |
| 0.1% | 4.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::alloc_impl_runtime[2]]` | `[native code]` |
| 0.1% | 4.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::allocate]` | `[native code]` |
| 0.1% | 4.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rust_alloc]` | `[native code]` |
| 0.1% | 4.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<usize>>::from_iter::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` | `[native code]` |
| 0.1% | 4.3ms | 0.1% | 4.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}]` | `[native code]` |
| 0.1% | 4.3ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sqrt]` | `[native code]` |
| 0.1% | 4.1ms | 0.0% | 2.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::shared::smallsort::CopyOnDrop<usize> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` | `[native code]` |
| 0.0% | 3.2ms | 0.0% | 3.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::unlink_chunk]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index]` | `[native code]` |
| 0.0% | 3.1ms | 0.0% | 3.1ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::hint::assert_unchecked::precondition_check[4]]` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<u8>>]` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` | `[native code]` |
| 0.0% | 3.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<u8>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter[1]]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::spec_extend]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.0% | 2.9ms | 0.0% | 2.9ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 2.8ms | 0.0% | 2.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter]` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}]` | `[native code]` |
| 0.0% | 2.7ms | 0.0% | 2.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::max[1]]` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::spec_extend]` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>]` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::spec_extend]` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` | `[native code]` |
| 0.0% | 2.5ms | 0.0% | 1.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::admit_jacobi_eigh]` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 1.8ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<&alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter]` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::IterMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::zip::<&alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.0% | 1.8ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::spec_extend]` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 1.7ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::reserve]` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::grow]` | `[native code]` |
| 0.0% | 1.7ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::append_elements]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::spec_extend]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::reserve]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>]` | `[native code]` |
| 0.0% | 1.6ms | 0.0% | 1.6ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::map::<f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::powf]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[pow]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::insert_large_chunk]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::num::imp::bignum::Big32x40>::mul_pow2]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 1.5ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate::<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), <core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::spec_extend]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]` | `[native code]` |
| 0.0% | 1.5ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[2]]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::take::Take<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::ToString>::to_string]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::SpecToString>::spec_to_string]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::spec_extend]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 1.4ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call::<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}]` | `[native code]` |
| 0.0% | 1.4ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::sys::System as dlmalloc[5db836cf0c58e369]::Allocator>::alloc]` | `[native code]` |
| 0.0% | 1.3ms | 0.0% | 1.3ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::chunks_mut]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<u32 as core[9097705de7cf5a87]::fmt::Display>::fmt]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::to_bits]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::set_len_on_drop::SetLenOnDrop>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insertion_sort_shift_left::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<usize>>]` | `[native code]` |
| 0.0% | 1.2ms | 0.0% | 1.2ms | `fs_cmaes_viz_wasm.wasm.wasm-function[<usize>::checked_mul]` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 0us | `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |
| 0.0% | 1.0ms | 0.0% | 1.0ms | `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]` | `[native code]` |

## Function Details

### `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]`
`[native code]` | Self: 17.9% (622.7ms) | Total: 17.9% (622.7ms) | Samples: 415

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` (110)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (108)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` (60)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]` (52)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` (50)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (17)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::reduce_pio2]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]`
`[native code]` | Self: 9.4% (327.6ms) | Total: 58.1% (2.01s) | Samples: 219

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run_json]` (1332)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (310)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec]` (261)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (169)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (71)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (55)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::evaluate]` (42)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>]` (37)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` (29)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix]` (20)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::rebuild_c]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index_mut]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (7)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::copy_from_slice_impl::<f64>]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::clone::Clone>::clone]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::vec::from_elem::<f64>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked[1]]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<usize>>]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<usize>>::index_mut]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sqrt]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::take::Take<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::exp]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::map::<f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::grisu::format_shortest_opt]`
`[native code]` | Self: 7.6% (263.2ms) | Total: 7.6% (263.2ms) | Samples: 177

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]` (177)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]`
`[native code]` | Self: 4.7% (166.0ms) | Total: 7.6% (265.6ms) | Samples: 109

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad_formatted_parts]` (176)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` (37)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow[4]]` (18)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (12)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]`
`[native code]` | Self: 4.3% (151.0ms) | Total: 4.3% (151.0ms) | Samples: 100

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}>>::{closure#0}>::{closure#0}>]` (68)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]`
`[native code]` | Self: 4.1% (143.0ms) | Total: 4.1% (143.0ms) | Samples: 97

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]` (95)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]`
`[native code]` | Self: 2.7% (94.2ms) | Total: 30.2% (1.04s) | Samples: 64

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (694)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` (443)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (106)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` (34)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory]` (19)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_dealloc]` (10)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String as core[9097705de7cf5a87]::convert::From<&str>>::from]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]`
`[native code]` | Self: 2.6% (91.1ms) | Total: 5.2% (182.8ms) | Samples: 60

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (106)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[4]]` (25)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner<_>>::reserve::do_reserve_and_handle::<alloc[979189866cb66e31]::alloc::Global>]` (20)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::raw::from_raw_parts::precondition_check]` (14)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::append_elements]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}]`
`[native code]` | Self: 2.0% (70.2ms) | Total: 8.3% (289.5ms) | Samples: 47

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (190)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}>>::{closure#0}>::{closure#0}>]` (143)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]`
`[native code]` | Self: 1.9% (69.1ms) | Total: 21.3% (737.3ms) | Samples: 47

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (443)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (44)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format::format_inner]` (443)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 1.9% (67.1ms) | Total: 6.3% (219.3ms) | Samples: 42

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}]` (143)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` (68)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}]` (33)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]`
`[native code]` | Self: 1.9% (67.1ms) | Total: 18.0% (623.6ms) | Samples: 44

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` (415)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad_formatted_parts]` (186)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::grisu::format_shortest_opt]` (177)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::dragon::format_shortest]` (8)

### `(unknown)`
`[native code]` | Self: 1.9% (66.0ms) | Total: 99.4% (3.44s) | Samples: 42

**Called by:**
- `cmaes_viz_run` (2282)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run multivalue shim]` (2240)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]`
`[native code]` | Self: 1.8% (63.0ms) | Total: 1.9% (65.9ms) | Samples: 39

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` (19)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` (12)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[1]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_alloc]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[3]]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::insert_large_chunk]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::sys::System as dlmalloc[5db836cf0c58e369]::Allocator>::alloc]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}]`
`[native code]` | Self: 1.4% (49.5ms) | Total: 1.4% (49.5ms) | Samples: 33

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}::{closure#0}>>::{closure#0}>::{closure#0}>]` (33)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]`
`[native code]` | Self: 1.3% (47.5ms) | Total: 1.6% (57.8ms) | Samples: 32

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` (27)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (10)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::allocate]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]`
`[native code]` | Self: 1.3% (45.0ms) | Total: 8.5% (296.5ms) | Samples: 31

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (169)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (31)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (108)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` (12)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::abs[1]]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::vec::from_elem::<f64>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter[1]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::admit_jacobi_eigh]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::max[1]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<usize>>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<usize>>::index_mut]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::evaluate]`
`[native code]` | Self: 1.2% (43.6ms) | Total: 1.8% (63.7ms) | Samples: 29

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (42)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::pow::pow]` (12)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::powf]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[4]]`
`[native code]` | Self: 1.1% (40.3ms) | Total: 1.1% (40.3ms) | Samples: 27

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (25)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]`
`[native code]` | Self: 1.1% (39.4ms) | Total: 1.8% (63.3ms) | Samples: 26

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (23)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]` (7)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` (15)

### `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]`
`[native code]` | Self: 1.1% (38.0ms) | Total: 2.5% (88.8ms) | Samples: 26

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` (37)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow[4]]` (17)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (19)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` (15)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory]`
`[native code]` | Self: 1.0% (35.6ms) | Total: 1.0% (35.6ms) | Samples: 23

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (19)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]`
`[native code]` | Self: 1.0% (35.4ms) | Total: 1.7% (61.8ms) | Samples: 24

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (34)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::grow_amortized]` (11)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::char::methods::encode_utf8_raw_unchecked]` (7)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]`
`[native code]` | Self: 0.9% (34.3ms) | Total: 3.0% (105.7ms) | Samples: 23

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (71)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (31)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::rebuild_c]` (7)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked[1]]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::IterMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::zip::<&alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::slice::index::SliceIndex<[f64]>>::index]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]`
`[native code]` | Self: 0.9% (33.3ms) | Total: 1.0% (36.6ms) | Samples: 22

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_dealloc]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::unlink_chunk]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::rebuild_c]`
`[native code]` | Self: 0.9% (31.2ms) | Total: 0.9% (31.2ms) | Samples: 20

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (7)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory[1]]`
`[native code]` | Self: 0.8% (29.7ms) | Total: 0.8% (29.7ms) | Samples: 15

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]` (15)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.8% (28.3ms) | Total: 0.8% (28.3ms) | Samples: 19

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (4)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]`
`[native code]` | Self: 0.7% (26.7ms) | Total: 5.5% (191.9ms) | Samples: 18

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (112)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sqrt]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (110)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::to_bits]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]`
`[native code]` | Self: 0.7% (26.3ms) | Total: 13.3% (463.6ms) | Samples: 17

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (310)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` (112)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (99)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` (38)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` (22)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::reduce_pio2]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::ChunksMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::chunks_mut]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]`
`[native code]` | Self: 0.7% (26.3ms) | Total: 0.7% (26.3ms) | Samples: 18

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (12)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix]`
`[native code]` | Self: 0.6% (24.0ms) | Total: 0.8% (30.9ms) | Samples: 17

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (20)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::vec::from_elem::<f64>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format::format_inner]`
`[native code]` | Self: 0.6% (23.8ms) | Total: 19.3% (668.1ms) | Samples: 16

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` (443)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` (428)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]`
`[native code]` | Self: 0.6% (22.3ms) | Total: 18.7% (650.4ms) | Samples: 14

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format::format_inner]` (428)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]` (415)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u32 as core[9097705de7cf5a87]::fmt::Display>::fmt]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::raw::from_raw_parts::precondition_check]`
`[native code]` | Self: 0.6% (20.9ms) | Total: 0.6% (20.9ms) | Samples: 14

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (14)

### `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::pow::pow]`
`[native code]` | Self: 0.5% (20.1ms) | Total: 0.5% (20.1ms) | Samples: 13

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::evaluate]` (12)
- `fs_cmaes_viz_wasm.wasm.wasm-function[pow]` (1)

### `decode`
`[native code]` | Self: 0.5% (18.0ms) | Total: 0.5% (18.0ms) | Samples: 12

**Called by:**
- `cmaes_viz_run` (12)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]`
`[native code]` | Self: 0.4% (16.7ms) | Total: 0.4% (16.7ms) | Samples: 10

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow]`
`[native code]` | Self: 0.4% (16.3ms) | Total: 1.1% (38.7ms) | Samples: 11

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::grow_amortized]` (25)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::grow]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]`
`[native code]` | Self: 0.4% (15.9ms) | Total: 1.4% (50.3ms) | Samples: 11

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (13)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory[1]]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.4% (15.8ms) | Total: 10.1% (349.7ms) | Samples: 10

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>]` (229)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}]` (190)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (23)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad_formatted_parts]`
`[native code]` | Self: 0.4% (14.0ms) | Total: 8.1% (281.2ms) | Samples: 9

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]` (186)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` (176)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow[4]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_dealloc]`
`[native code]` | Self: 0.3% (13.1ms) | Total: 0.5% (18.7ms) | Samples: 9

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (10)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>]`
`[native code]` | Self: 0.3% (12.3ms) | Total: 10.4% (362.0ms) | Samples: 8

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>>::from_iter]` (237)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (229)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]`
`[native code]` | Self: 0.3% (11.5ms) | Total: 3.0% (104.5ms) | Samples: 7

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (68)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` (44)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_dealloc]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String as core[9097705de7cf5a87]::convert::From<&str>>::from]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]`
`[native code]` | Self: 0.3% (11.3ms) | Total: 0.6% (22.3ms) | Samples: 7

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::grow]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::hint::assert_unchecked::precondition_check[4]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index_mut]`
`[native code]` | Self: 0.3% (10.9ms) | Total: 0.3% (10.9ms) | Samples: 8

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (8)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::grow_amortized]`
`[native code]` | Self: 0.3% (10.7ms) | Total: 1.4% (49.4ms) | Samples: 7

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner<_>>::reserve::do_reserve_and_handle::<alloc[979189866cb66e31]::alloc::Global>]` (21)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` (11)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow]` (25)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::dragon::format_shortest]`
`[native code]` | Self: 0.3% (10.5ms) | Total: 0.3% (12.0ms) | Samples: 7

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::float::float_to_decimal_common_shortest::<f64>]` (8)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::num::imp::bignum::Big32x40>::mul_pow2]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::char::methods::encode_utf8_raw_unchecked]`
`[native code]` | Self: 0.2% (10.3ms) | Total: 0.2% (10.3ms) | Samples: 7

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` (7)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec]`
`[native code]` | Self: 0.2% (10.3ms) | Total: 11.5% (399.4ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (261)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>>::from_iter]` (255)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.2% (8.9ms) | Total: 0.2% (8.9ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]`
`[native code]` | Self: 0.2% (8.9ms) | Total: 2.5% (88.0ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` (38)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (14)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (52)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.2% (8.7ms) | Total: 0.6% (21.5ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (15)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::shared::smallsort::CopyOnDrop<usize> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[3]]`
`[native code]` | Self: 0.2% (8.7ms) | Total: 0.3% (12.0ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as alloc[979189866cb66e31]::vec::spec_from_elem::SpecFromElem>::from_elem::<alloc[979189866cb66e31]::alloc::Global>]` (8)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked[1]]`
`[native code]` | Self: 0.2% (8.5ms) | Total: 0.3% (11.8ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::ChunksMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.2% (8.3ms) | Total: 0.2% (8.3ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]`
`[native code]` | Self: 0.2% (8.2ms) | Total: 4.0% (141.4ms) | Samples: 5

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (42)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (38)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (13)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (50)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]` (38)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}]`
`[native code]` | Self: 0.2% (8.2ms) | Total: 0.2% (8.2ms) | Samples: 6

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}]`
`[native code]` | Self: 0.2% (7.7ms) | Total: 0.2% (7.7ms) | Samples: 5

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (5)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check]`
`[native code]` | Self: 0.2% (7.7ms) | Total: 0.2% (7.7ms) | Samples: 5

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]`
`[native code]` | Self: 0.2% (7.4ms) | Total: 0.7% (25.8ms) | Samples: 5

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` (14)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String as core[9097705de7cf5a87]::convert::From<&str>>::from]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::SpecToString>::spec_to_string]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]` (10)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[4]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::hint::assert_unchecked::precondition_check[4]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]`
`[native code]` | Self: 0.2% (7.3ms) | Total: 0.2% (7.3ms) | Samples: 5

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::stable::merge::MergeState<usize>>::merge_down::<<[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[1]]`
`[native code]` | Self: 0.1% (6.3ms) | Total: 0.2% (8.9ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.1% (6.2ms) | Total: 0.4% (15.2ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (9)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort8_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::slice::index::SliceIndex<[f64]>>::index]`
`[native code]` | Self: 0.1% (5.9ms) | Total: 0.1% (5.9ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::abs[1]]`
`[native code]` | Self: 0.1% (5.8ms) | Total: 0.1% (5.8ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (4)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]`
`[native code]` | Self: 0.1% (5.7ms) | Total: 5.1% (176.8ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (99)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sqrt]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` (42)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` (40)
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (17)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]` (14)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter[1]]`
`[native code]` | Self: 0.1% (5.5ms) | Total: 0.1% (5.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::expm1_core]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::copy_from_slice_impl::<f64>]`
`[native code]` | Self: 0.1% (5.2ms) | Total: 0.2% (8.2ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[1]]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::IndexMut<usize>>::index_mut]`
`[native code]` | Self: 0.1% (5.0ms) | Total: 0.1% (5.0ms) | Samples: 4

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[1]]`
`[native code]` | Self: 0.1% (4.7ms) | Total: 0.1% (4.7ms) | Samples: 3

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::copy_from_slice_impl::<f64>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>>::from_iter]`
`[native code]` | Self: 0.1% (4.6ms) | Total: 11.2% (389.1ms) | Samples: 3

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec]` (255)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>]` (237)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` (15)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.1% (4.5ms) | Total: 0.2% (9.0ms) | Samples: 3

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort8_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::reduce_pio2]`
`[native code]` | Self: 0.1% (4.5ms) | Total: 0.8% (28.0ms) | Samples: 3

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (16)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}]`
`[native code]` | Self: 0.1% (4.3ms) | Total: 0.1% (4.3ms) | Samples: 3

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]`
`[native code]` | Self: 0.1% (4.2ms) | Total: 0.7% (26.5ms) | Samples: 3

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` (18)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]` (15)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]`
`[native code]` | Self: 0.0% (3.3ms) | Total: 2.9% (102.5ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (40)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (22)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (60)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add[1]]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::unlink_chunk]`
`[native code]` | Self: 0.0% (3.2ms) | Total: 0.0% (3.2ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]`
`[native code]` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::spec_extend]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad]`
`[native code]` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<core[9097705de7cf5a87]::ops::range::Range<usize>>>::index]`
`[native code]` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::hint::assert_unchecked::precondition_check[4]]`
`[native code]` | Self: 0.0% (3.1ms) | Total: 0.0% (3.1ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]`
`[native code]` | Self: 0.0% (3.1ms) | Total: 1.2% (43.3ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (29)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` (26)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.0% (3.0ms) | Total: 1.4% (48.9ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::quicksort::quicksort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (33)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (9)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort8_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]`
`[native code]` | Self: 0.0% (3.0ms) | Total: 0.1% (4.6ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::spec_extend]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::reserve]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter[1]]`
`[native code]` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.0% (2.9ms) | Total: 0.0% (2.9ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow[4]]`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.8% (27.8ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::write_formatted_parts]` (18)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::fmt::Formatter>::pad_formatted_parts]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_realloc]` (17)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter]`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.0% (2.8ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::stable::merge::MergeState<usize>>::merge_down::<<[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.0% (2.8ms) | Total: 0.1% (4.4ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::sort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::max[1]]`
`[native code]` | Self: 0.0% (2.7ms) | Total: 0.0% (2.7ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::shared::smallsort::CopyOnDrop<usize> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]`
`[native code]` | Self: 0.0% (2.6ms) | Total: 0.1% (4.1ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[2]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]`
`[native code]` | Self: 0.0% (2.5ms) | Total: 0.3% (12.2ms) | Samples: 2

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::raw_vec::RawVec<u8>>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::current_memory]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::free]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<&alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter]`
`[native code]` | Self: 0.0% (1.8ms) | Total: 0.0% (1.8ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::IterMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::zip::<&alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.0% (1.7ms) | Total: 0.0% (1.7ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]`
`[native code]` | Self: 0.0% (1.7ms) | Total: 0.1% (5.6ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::spec_extend]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}]`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.2% (9.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::slice::index::SliceIndex<[f64]>>::index]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::reserve]`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]`
`[native code]` | Self: 0.0% (1.6ms) | Total: 1.1% (40.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` (26)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` (18)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` (8)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.2% (9.1ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insertion_sort_shift_left::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::shared::smallsort::CopyOnDrop<usize> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[1]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::map::<f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>]`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (1.6ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]`
`[native code]` | Self: 0.0% (1.6ms) | Total: 0.0% (3.0ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::spec_extend]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as alloc[979189866cb66e31]::vec::spec_from_elem::SpecFromElem>::from_elem::<alloc[979189866cb66e31]::alloc::Global>]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.3% (13.6ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::vec::from_elem::<f64>]` (9)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[3]]` (8)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.6% (22.3ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` (15)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (7)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::insert_large_chunk]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.1% (4.4ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::num::imp::bignum::Big32x40>::mul_pow2]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::num::imp::flt2dec::strategy::dragon::format_shortest]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate::<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}]`
`[native code]` | Self: 0.0% (1.5ms) | Total: 0.0% (1.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), <core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::copy_nonoverlapping::precondition_check[2]]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::shared::smallsort::CopyOnDrop<usize> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::take::Take<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<usize>>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::driftsort_main::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}, alloc[979189866cb66e31]::vec::Vec<usize>>]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 1.5% (54.8ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>]` (37)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::sort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (36)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call::<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 0.0% (1.4ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]`
`[native code]` | Self: 0.0% (1.4ms) | Total: 1.3% (45.1ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>>::from_iter]` (15)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]` (27)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::mul_add]`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.1% (4.4ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::fma::fma]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::sys::System as dlmalloc[5db836cf0c58e369]::Allocator>::alloc]`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::chunks_mut]`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (1.3ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<fs_cmaes_viz_wasm[f41f8845dbaf9001]::Lcg>::fill_gaussian]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::admit_jacobi_eigh]`
`[native code]` | Self: 0.0% (1.3ms) | Total: 0.0% (2.5ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize>::checked_mul]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<u32 as core[9097705de7cf5a87]::fmt::Display>::fmt]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::to_bits]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::set_len_on_drop::SetLenOnDrop>]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<usize>>]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<usize>::checked_mul]`
`[native code]` | Self: 0.0% (1.2ms) | Total: 0.0% (1.2ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::admit_jacobi_eigh]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (1.0ms) | Total: 0.0% (1.0ms) | Samples: 1

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::exp]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::expm1_core]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::reserve]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::append_elements]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner<_>>::reserve::do_reserve_and_handle::<alloc[979189866cb66e31]::alloc::Global>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::append_elements]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::reserve]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::alloc_impl_runtime[2]]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::allocate]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rust_alloc]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (9.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::fmt::write]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_alloc]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format::format_inner]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::allocate]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::alloc_impl_runtime[2]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]`
`[native code]` | Self: 0.0% (0us) | Total: 1.3% (46.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (32)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (14)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::ToString>::to_string]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::spec_extend]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[wasm_bindgen[928881921d014e43]::__rt::maybe_catch_unwind::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}, alloc[979189866cb66e31]::string::String>]`
`[native code]` | Self: 0.0% (0us) | Total: 97.5% (3.37s) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run]` (2240)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}]` (2240)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (1)

### `(module)`
`/Users/jemanuel/projects/cmaes_explainer/[stdin]:5` | Self: 0.0% (0us) | Total: 100.0% (3.46s) | Samples: 0

**Calls:**
- `cmaes_viz_run` (2282)
- `cmaes_viz_run` (12)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::quicksort::quicksort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 1.4% (48.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::create_run::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (33)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (33)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::is_nan[1]]`
`[native code]` | Self: 0.0% (0us) | Total: 2.4% (84.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (55)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` (16)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin_core]` (13)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::cos_core]` (6)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::reduce_pio2]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::ChunksMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::spec_extend]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call::<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.7ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::index::Index<usize>>::index]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::total_cmp]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::create_run::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 1.4% (48.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::sort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (33)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::quicksort::quicksort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (33)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<usize>>::from_iter::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<usize>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` (4)

### `cmaes_viz_run`
`/Users/jemanuel/Library/Caches/codex-wasm-build/fs-cmaes-viz-wasm-dev-20260827T1621Z/fs_cmaes_viz_wasm.js:57` | Self: 0.0% (0us) | Total: 99.4% (3.44s) | Samples: 0

**Called by:**
- `(module)` (2282)

**Calls:**
- `(unknown)` (2282)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run_json]`
`[native code]` | Self: 0.0% (0us) | Total: 97.5% (3.37s) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::cmaes_viz_run]` (2240)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (1332)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (902)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::VizRun>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::ToString>::to_string]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::SpecToString>::spec_to_string]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rust_alloc]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::alloc_impl_runtime[2]]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_alloc]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::clone::Clone>::clone]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` (4)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::powf]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::evaluate]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[pow]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::IterMut<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::zip::<&alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<&alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::IntoIterator>::into_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>::{closure#0}>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run]`
`[native code]` | Self: 0.0% (0us) | Total: 97.5% (3.37s) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run multivalue shim]` (2240)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[wasm_bindgen[928881921d014e43]::__rt::maybe_catch_unwind::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}, alloc[979189866cb66e31]::string::String>]` (2240)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}]`
`[native code]` | Self: 0.0% (0us) | Total: 97.5% (3.37s) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[wasm_bindgen[928881921d014e43]::__rt::maybe_catch_unwind::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}, alloc[979189866cb66e31]::string::String>]` (2240)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::cmaes_viz_run]` (2240)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (9.1ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insertion_sort_shift_left::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>]`
`[native code]` | Self: 0.0% (0us) | Total: 1.5% (54.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (37)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::driftsort_main::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}, alloc[979189866cb66e31]::vec::Vec<usize>>]` (37)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::spec_extend]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<u8>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (9.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner<_>>::reserve::do_reserve_and_handle::<alloc[979189866cb66e31]::alloc::Global>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.9% (33.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (20)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::reserve]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::grow_amortized]` (21)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]`
`[native code]` | Self: 0.0% (0us) | Total: 4.2% (146.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]` (98)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (95)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::raw_vec::RawVec<u8>>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::spec_extend]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<usize, <alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted<core[9097705de7cf5a87]::ops::range::Range<usize>>::{closure#0}>::{closure#0}>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::VizRun>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (9.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run_json]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String as core[9097705de7cf5a87]::convert::From<&str>>::from]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.7ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[pow]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64>::powf]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[compiler_builtins[534fb3d5b332f2c1]::math::libm_math::pow::pow]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::adapters::map::map_fold<&f64, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<usize>>::from_iter::<core[9097705de7cf5a87]::ops::range::Range<usize>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<usize>>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rdl_alloc]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (6.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[__rustc[1b6846d77d192586]::__rust_alloc]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<dlmalloc[5db836cf0c58e369]::dlmalloc::Dlmalloc<dlmalloc[5db836cf0c58e369]::sys::System>>::malloc]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run multivalue shim]`
`[native code]` | Self: 0.0% (0us) | Total: 97.5% (3.37s) | Samples: 0

**Called by:**
- `(unknown)` (2240)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[cmaes_viz_run]` (2240)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global as core[9097705de7cf5a87]::alloc::Allocator>::grow]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.7ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::finish_grow]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::alloc::Global>::grow_impl_runtime]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<u8>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (9.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::VizRun>]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::clone::Clone>::clone]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::try_allocate_in[1]]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (3.1ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>>::from_iter]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::cmaes_viz_run]`
`[native code]` | Self: 0.0% (0us) | Total: 97.5% (3.37s) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::js::_::__wasm_bindgen_generated_cmaes_viz_run::{closure#0}]` (2240)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run_json]` (2240)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#10}>>>::from_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>::{closure#0}>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#11}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::raw_vec::RawVec<u8>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[1]]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (9.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>>]` (6)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>]` (6)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::spec_extend]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::with_capacity_in]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), <core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::spec_extend]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insertion_sort_shift_left::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[usize]>::sort_by::<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::insert_tail::<usize, <[usize]>::sort_by<fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#1}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next[1]]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort8_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (6.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::small_sort_general_with_scratch::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::sort4_stable::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::shared::smallsort::bidirectional_merge::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::spec_extend]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sqrt]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::sin]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::ln]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::expm1_core]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_math[662b985709b1178d]::det::exp]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<[f64]>::iter[1]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), <core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<_> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::enumerate::<&f64, (), core[9097705de7cf5a87]::iter::adapters::map::map_fold<(usize, &f64), f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>::{closure#0}>::{closure#0}>::{closure#0}]` (1)

### `cmaes_viz_run`
`/Users/jemanuel/Library/Caches/codex-wasm-build/fs-cmaes-viz-wasm-dev-20260827T1621Z/fs_cmaes_viz_wasm.js:60` | Self: 0.0% (0us) | Total: 0.5% (18.0ms) | Samples: 0

**Called by:**
- `(module)` (12)

**Calls:**
- `decode` (12)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.2% (8.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<usize as core[9097705de7cf5a87]::iter::range::Step>::forward_unchecked[1]]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>>::from_iter]` (4)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#14}>>>::from_iter]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize>>::extend_trusted::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::SpecToString>::spec_to_string]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as alloc[979189866cb66e31]::string::ToString>::to_string]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<u8 as <[_]>::to_vec_in::ConvertVec>::to_vec::<alloc[979189866cb66e31]::alloc::Global>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::spec_extend]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::sort::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 1.5% (53.3ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::driftsort_main::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}, alloc[979189866cb66e31]::vec::Vec<usize>>]` (36)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::slice::sort::stable::drift::create_run::<usize, <[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (33)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::sort::stable::merge::MergeState<usize>>::merge_down::<<[usize]>::sort_by<fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#6}>::{closure#0}>]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::vec::from_elem::<f64>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.3% (13.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as alloc[979189866cb66e31]::vec::spec_from_elem::SpecFromElem>::from_elem::<alloc[979189866cb66e31]::alloc::Global>]` (9)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<usize>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (5.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (4)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<usize>>::from_iter::<core[9097705de7cf5a87]::ops::range::Range<usize>>]` (3)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<usize> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<usize, core[9097705de7cf5a87]::ops::range::Range<usize>>>::from_iter]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next[1]]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::next]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<i32> as core[9097705de7cf5a87]::iter::range::RangeIteratorImpl>::spec_next]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>>::spec_extend]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::iter::adapters::enumerate::Enumerate<core[9097705de7cf5a87]::slice::iter::Iter<f64>>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#5}>>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::mat_vec::{closure#0}>>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::set_len_on_drop::SetLenOnDrop>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.8ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (3)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#15}>>]` (3)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]`
`[native code]` | Self: 0.0% (0us) | Total: 0.1% (4.6ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter::SpecFromIter<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::from_iter]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>]` (2)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_la[4bf282302406fd01]::eigen::jacobi_eigh::{closure#0}>>>::spec_extend]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, f64, f64, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::ok_envelope]`
`[native code]` | Self: 0.0% (0us) | Total: 39.1% (1.35s) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run_json]` (902)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num_arr]` (694)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::string::String>]` (98)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<u8>>]` (68)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::byte_arr]` (32)
- `fs_cmaes_viz_wasm.wasm.wasm-function[alloc[979189866cb66e31]::fmt::format]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::num]` (4)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::string::String>::push_str]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::slice::iter::Iter<f64>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::transform_matrix::{closure#0}>>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::slice::iter::Iter<f64> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::size_hint]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.5% (20.7ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (7)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<fs_cmaes_viz_wasm[f41f8845dbaf9001]::GenSnapshot>]` (5)
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_la[4bf282302406fd01]::eigen::jacobi_eigh]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]` (5)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.2ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::sum::<f64>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<f64, <f64 as core[9097705de7cf5a87]::iter::traits::accum::Sum>::sum<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::project_phase_space::{closure#0}>>::{closure#0}>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::for_each::<<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, f64, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<f64, <alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>::{closure#0}>::{closure#0}>::{closure#0}>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<u8>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (3.0ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<u8>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::ops::range::Range<usize> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::adapters::map::map_fold<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::fold::<(), core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::iter::adapters::map::map_fold::<usize, u8, (), fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}, core[9097705de7cf5a87]::iter::traits::iterator::Iterator::for_each::call<u8, <alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>::{closure#0}>::{closure#0}>::{closure#0}]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (1.4ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<u8, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>>::from_iter]` (1)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<u8>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#7}>>]` (1)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}> as core[9097705de7cf5a87]::iter::traits::iterator::Iterator>::collect::<alloc[979189866cb66e31]::vec::Vec<f64>>]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as core[9097705de7cf5a87]::iter::traits::collect::FromIterator<f64>>::from_iter::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]` (2)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVec<f64> as core[9097705de7cf5a87]::ops::drop::Drop>::drop]`
`[native code]` | Self: 0.0% (0us) | Total: 0.5% (19.5ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run]` (8)
- `fs_cmaes_viz_wasm.wasm.wasm-function[core[9097705de7cf5a87]::ptr::drop_glue::<alloc[979189866cb66e31]::vec::Vec<f64>>]` (5)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::raw_vec::RawVecInner>::deallocate[2]]` (13)

### `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_extend::SpecExtend<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::spec_extend]`
`[native code]` | Self: 0.0% (0us) | Total: 0.0% (2.9ms) | Samples: 0

**Called by:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64> as alloc[979189866cb66e31]::vec::spec_from_iter_nested::SpecFromIterNested<f64, core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>>::from_iter]` (2)

**Calls:**
- `fs_cmaes_viz_wasm.wasm.wasm-function[<alloc[979189866cb66e31]::vec::Vec<f64>>::extend_trusted::<core[9097705de7cf5a87]::iter::adapters::map::Map<core[9097705de7cf5a87]::ops::range::Range<usize>, fs_cmaes_viz_wasm[f41f8845dbaf9001]::cmaes_run::{closure#8}>>]` (2)

## Files

| Self% | Self | File |
|------:|-----:|------|
| 100.0% | 3.46s | `[native code]` |
