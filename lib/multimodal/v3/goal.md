## composites (article authoring)

```tsx
import { composite } from 'lib/multimodal'
import { Article, Title, Author, Heading, Paragraph, Code } from 'lib/article/mm.primitives'

const MyArticle = composite(({ renderTimestamp:number, modality:m }) => {
  return (
    <Article 
      modality={m}
      slug='my-article'
      renderedTimerstamp={renderTimestamp}>
      <CoverImage
        modality={m}
        src='/article-cover/my-article.png'
        alt='an img'>
      <Title modality={m}>my title</Title>
      <Paragraph modality={m}>
        lorem
        <Emphasize modality={m}>ipsum</Emphasize>
      </Paragraph>
      <Section
        modality={m}
        key='section-0'>
        <Heading 
          modality={m}
          level={2}>
          part 1
        </Heading>
        <Paragraph modality={m}> blah blah </Paragraph>
        <Code modality={m}>console.log()</Code>
      </Section>
    </Article>
  )
})
```

## article primitives

```tsx
import { primitive } from 'lib/multimodal'
import { Article, Title, Author, Heading, Paragraph, Code } from 'lib/article/mm.primitives'

const Heading = primitive<{ level:number }>({
    pojo: ({  modality:m, children, level  }) => 
       
    markdown: ({ modality:m, children, level }) => 
      <$>
        <$>{'#'.repeat(level)}</$>
        <$>{children}</$>
        <$>{'\n\n'}</$>
      </$>
})
```

## rendering

```tsx

const 

```