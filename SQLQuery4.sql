CREATE TABLE [tb_sku] (
  [id] bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [spu_id] bigint NOT NULL,
  [title] nvarchar(255) NOT NULL,
  [images] nvarchar(1000) DEFAULT '',
  [price] bigint NOT NULL DEFAULT 0,
  [indexes] nvarchar(100) NULL,
  [own_spec] nvarchar(1000) NULL,
  [enable] tinyint NOT NULL DEFAULT 1,
  [create_time] datetime NOT NULL,
  [last_update_time] datetime NOT NULL
);

-- 添加表注释
EXEC sp_addextendedproperty 
'MS_Description', N'sku表,该表表示具体的商品实体,如黑色的64GB的iphone 8', 
'SCHEMA', N'dbo', 'TABLE', N'tb_sku';

-- 添加列注释
EXEC sp_addextendedproperty 
'MS_Description', N'sku id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'id';

EXEC sp_addextendedproperty 
'MS_Description', N'spu id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'spu_id';

EXEC sp_addextendedproperty 
'MS_Description', N'商品标题', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'title';

EXEC sp_addextendedproperty 
'MS_Description', N'商品的图片，多个图片以'',''分割', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'images';

EXEC sp_addextendedproperty 
'MS_Description', N'销售价格，单位为分', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'price';

EXEC sp_addextendedproperty 
'MS_Description', N'特有规格属性在spu属性模板中的对应下标组合', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'indexes';

EXEC sp_addextendedproperty 
'MS_Description', N'sku的特有规格参数，json格式', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'own_spec';

EXEC sp_addextendedproperty 
'MS_Description', N'是否有效，0无效，1有效', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'enable';

EXEC sp_addextendedproperty 
'MS_Description', N'添加时间', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'create_time';

EXEC sp_addextendedproperty 
'MS_Description', N'最后修改时间', 'SCHEMA', N'dbo', 
'TABLE', N'tb_sku', 'COLUMN', N'last_update_time';

-- 创建索引
CREATE INDEX [key_spu_id] ON [tb_sku] ([spu_id]);