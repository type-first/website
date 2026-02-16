export const phantomValuesSnippet 
  = /* ts */ `
// Basic phantom value creation examples
import { t_, type_, t } from '@typefirst/typist';

// Create phantom values for any type
const user = t_<{ name: string; age: number }>();
const id = t_<string>();
const config = t_<{ theme: 'dark' | 'light' }>();

// All equivalent ways to create phantom values
const value1 = t_<string>();
const value2 = type_<string>();
const value3 = t<string>();

// Complex types work too
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

const response = t_<ApiResponse<User>>();

// Use phantom values for type-level operations
type UserType = typeof user; // { name: string; age: number }
`