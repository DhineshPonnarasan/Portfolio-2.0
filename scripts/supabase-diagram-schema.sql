-- Supabase schema for project_architecture and project_workflows
create table if not exists project_architecture (
  project_id text primary key,
  mermaid text not null
);

create table if not exists project_workflows (
  project_id text primary key,
  mermaid text not null
);
