CREATE TABLE [tb_spu] (
  [id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [title] nvarchar(255) NOT NULL DEFAULT '',
  [sub_title] nvarchar(255) DEFAULT '',
  [cid1] bigint NOT NULL,
  [cid2] bigint NOT NULL,
  [cid3] bigint NOT NULL,
  [brand_id] bigint NOT NULL,
  [saleable] tinyint NOT NULL DEFAULT 1,
  [valid] tinyint NOT NULL DEFAULT 1,
  [create_time] datetime NULL,
  [last_update_time] datetime NULL
);

-- 添加表注释
EXEC sp_addextendedproperty 
'MS_Description', N'spu表，该表描述的是一个抽象的商品', 
'SCHEMA', N'dbo', 'TABLE', N'tb_spu';

-- 添加列注释
EXEC sp_addextendedproperty 
'MS_Description', N'spu id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'id';

EXEC sp_addextendedproperty 
'MS_Description', N'标题', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'title';

EXEC sp_addextendedproperty 
'MS_Description', N'子标题', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'sub_title';

EXEC sp_addextendedproperty 
'MS_Description', N'1级类目id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'cid1';

EXEC sp_addextendedproperty 
'MS_Description', N'2级类目id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'cid2';

EXEC sp_addextendedproperty 
'MS_Description', N'3级类目id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'cid3';

EXEC sp_addextendedproperty 
'MS_Description', N'商品所属品牌id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'brand_id';

EXEC sp_addextendedproperty 
'MS_Description', N'是否上架，0下架，1上架', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'saleable';

EXEC sp_addextendedproperty 
'MS_Description', N'是否有效，0已删除，1有效', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'valid';

EXEC sp_addextendedproperty 
'MS_Description', N'添加时间', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'create_time';

EXEC sp_addextendedproperty 
'MS_Description', N'最后修改时间', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu', 'COLUMN', N'last_update_time';