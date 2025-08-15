import { useLoaderData } from 'react-router';
import Button from '@/lib/client/components/button.tsx';

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
    const response = await fetch('/api/graphql', {
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
    <div style={{ display: 'grid', gap: '40px', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h3
          style={{
            fontSize: '1.5rem',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Posts from GraphQL API
        </h3>

        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>No posts found</p>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {posts.map((post) => (
              <div
                key={post.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '10px',
                  }}
                >
                  <h4
                    style={{ margin: '0', fontSize: '1.2rem', color: '#333' }}
                  >
                    {post.title}
                  </h4>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: post.published ? '#4CAF50' : '#f44336',
                      color: 'white',
                    }}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p
                  style={{ margin: '10px 0', color: '#666', lineHeight: '1.5' }}
                >
                  {post.content}
                </p>
                <div
                  style={{ fontSize: '14px', color: '#888', marginTop: '15px' }}
                >
                  <strong>Author:</strong> {post.user.name} ({post.user.email})
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Button>Add Post</Button>
    </div>
  );
};
