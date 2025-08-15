import { useLoaderData } from 'react-router';
import { Button } from '@/lib/client/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/lib/client/components/ui/card.tsx';
import { Badge } from '@/lib/client/components/ui/badge.tsx';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface LoaderData {
  posts: Post[];
}

export const loader = async (): Promise<LoaderData> => {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetPosts {
            posts {
              id
              title
              content
              published
              user {
                id
                name
                email
              }
            }
          }
        `,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL errors:', result.errors);
      return { posts: [] };
    }

    return { posts: result.data.posts || [] };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { posts: [] };
  }
};

export const AppView = () => {
  const { posts } = useLoaderData() as LoaderData;

  console.log({ posts });

  return (
    <div className='container mx-auto py-8 space-y-8'>
      <div className='max-w-4xl mx-auto space-y-6'>
        <h3 className='text-2xl font-semibold text-center'>
          Posts from GraphQL API
        </h3>

        {posts.length === 0 ? (
          <p className='text-center text-muted-foreground'>No posts found</p>
        ) : (
          <div className='grid gap-6'>
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className='flex justify-between items-start'>
                    <CardTitle className='text-xl'>{post.title}</CardTitle>
                    <Badge variant={post.published ? 'default' : 'secondary'}>
                      {post.published ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-muted-foreground leading-relaxed'>
                    {post.content}
                  </p>
                  <div className='text-sm text-muted-foreground'>
                    <strong>Author:</strong> {post.user.name} ({post.user.email}
                    )
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className='max-w-md mx-auto space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>First Input</label>
          <input
            type='text'
            className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
          />
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Second Input</label>
          <input
            type='text'
            className='w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring'
          />
        </div>
        <Button className='w-full'>Add Post</Button>
      </div>
    </div>
  );
};
