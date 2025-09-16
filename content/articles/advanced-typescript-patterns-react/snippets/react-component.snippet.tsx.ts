export const genericComponentsSnippet 
  = /* tsx */ `
  
// Generic List Component Example
interface DataListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function DataList<T>({ items, renderItem }: DataListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage example
<DataList 
  items={users} 
  renderItem={(user) => <span>{user.name}</span>} 
/>  

`
