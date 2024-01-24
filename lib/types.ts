export type CommentSchemaType = {
  id: number;
  nick: string;
  email: string;
  email_md5: string;
  link: string;
  content: string;
  is_admin: number;
  is_hidden: number;
  timestamp: number;
  reply_count: number;
  path: string;
  parent_id: number;
  reply_id: number;
  reply_nick: string;
};
