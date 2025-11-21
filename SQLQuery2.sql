CREATE TABLE [tb_spu_detail] (
  [spu_id] bigint NOT NULL PRIMARY KEY,
  [description] ntext NULL,
  [generic_spec] nvarchar(max) NOT NULL DEFAULT '',
  [special_spec] nvarchar(1000) NOT NULL,
  [packing_list] nvarchar(3000) DEFAULT '',
  [after_service] nvarchar(3000) DEFAULT ''
);

-- 添加表注释
EXEC sp_addextendedproperty 
'MS_Description', N'spu详情表', 
'SCHEMA', N'dbo', 'TABLE', N'tb_spu_detail';

-- 添加列注释
EXEC sp_addextendedproperty 
'MS_Description', N'spu id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu_detail', 'COLUMN', N'spu_id';

EXEC sp_addextendedproperty 
'MS_Description', N'商品描述信息', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu_detail', 'COLUMN', N'description';

EXEC sp_addextendedproperty 
'MS_Description', N'通用规格参数数据', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu_detail', 'COLUMN', N'generic_spec';

EXEC sp_addextendedproperty 
'MS_Description', N'特有规格参数及可选值信息，json格式', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu_detail', 'COLUMN', N'special_spec';

EXEC sp_addextendedproperty 
'MS_Description', N'包装清单', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu_detail', 'COLUMN', N'packing_list';

EXEC sp_addextendedproperty 
'MS_Description', N'售后服务', 'SCHEMA', N'dbo', 
'TABLE', N'tb_spu_detail', 'COLUMN', N'after_service';