export const advancedPatternsSnippet 
  = /* ts */ `
// Advanced type-level programming patterns
import { t_, $Equal, $Extends, example_, yes_, no_, extends_ } from '@typefirst/typist';

// Deep readonly transformation
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

example_('Deep readonly transformation', () => {
  type Nested = {
    user: {
      profile: {
        name: string;
        settings: { theme: string };
      };
    };
    count: number;
  };
  
  type ReadonlyNested = DeepReadonly<Nested>;
  
  // Test deep transformation
  extends_<ReadonlyNested['count'], number>();
  extends_<ReadonlyNested['user']['profile']['name'], string>();
  
  return t_<DeepReadonly<any>>();
});

// Conditional type filtering
type NonFunctionKeys<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

example_('Type filtering with conditionals', () => {
  type Mixed = {
    name: string;
    age: number;
    getName: () => string;
    setAge: (age: number) => void;
  };
  
  type DataKeys = NonFunctionKeys<Mixed>;
  
  yes_<$Equal<DataKeys, 'name' | 'age'>>();
  
  return t_<DataKeys>();
});

// Branded types validation
type UserId = string & { readonly brand: unique symbol };
type ProductId = string & { readonly brand: unique symbol };

example_('Branded types', () => {
  // These should be different types despite both being strings
  const userIdTest = $Equal<UserId, ProductId>;
  no_(userIdTest); // They should NOT be equal
  
  return t_<boolean>();
});
`