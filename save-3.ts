import { has_, is_ } from "@typefirst/typist";

type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string }

const successResult = { success: true, data: 'hello' } as const
const errorResult = { success: false, error: 'failed' } as const

is_<Result<string>>(successResult) // ✓ Matches success variant
is_<Result<string>>(errorResult)   // ✓ Matches error variant

// Extract specific variants
if (successResult.success) {
  is_<string>(successResult.data)  // ✓ Type narrowed to data
}

has_<'name'>( { name: 'Alice' } ) // ✓