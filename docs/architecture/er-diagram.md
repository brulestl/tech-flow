# Database Schema ER Diagram

```mermaid
erDiagram
    users ||--o{ resources : creates
    users ||--o{ collections : owns
    resources }o--o{ collections : belongs_to
    resources }o--o{ tags : has
    users {
        uuid id PK
        string email UK
        string full_name
        string avatar_url
        enum role
        timestamp created_at
        timestamp updated_at
    }
    resources {
        uuid id PK
        string title
        string description
        string url
        enum type
        uuid user_id FK
        timestamp created_at
        timestamp updated_at
    }
    collections {
        uuid id PK
        string name
        string description
        uuid user_id FK
        boolean is_public
        timestamp created_at
        timestamp updated_at
    }
    tags {
        uuid id PK
        string name UK
        timestamp created_at
    }
    resource_collections {
        uuid resource_id PK,FK
        uuid collection_id PK,FK
        timestamp created_at
    }
    resource_tags {
        uuid resource_id PK,FK
        uuid tag_id PK,FK
        timestamp created_at
    }
```

## Entity Relationships

1. **Users**
   - One user can create many resources (1:N)
   - One user can own many collections (1:N)

2. **Resources**
   - Each resource belongs to one user (N:1)
   - Resources can belong to multiple collections (M:N)
   - Resources can have multiple tags (M:N)

3. **Collections**
   - Each collection belongs to one user (N:1)
   - Collections can contain multiple resources (M:N)

4. **Tags**
   - Tags can be associated with multiple resources (M:N)

## Key Features

- UUID primary keys for all tables
- Timestamps for creation and updates
- Row-level security enabled on all tables
- Cascading deletes for related records
- Unique constraints on email and tag names
- Enum types for user roles and resource types

## Security

- Row-level security (RLS) policies ensure:
  - Users can only access their own data
  - Public collections are viewable by all authenticated users
  - Resource access is controlled through collection membership
  - Tag access is controlled through resource ownership 