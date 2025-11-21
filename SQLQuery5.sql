CREATE TABLE [tb_stock] (
  [sku_id] bigint NOT NULL PRIMARY KEY,
  [seckill_stock] int DEFAULT 0,
  [seckill_total] int DEFAULT 0,
  [stock] int NOT NULL
);

-- 添加表注释
EXEC sp_addextendedproperty 
'MS_Description', N'库存表，代表库存，秒杀库存等信息', 
'SCHEMA', N'dbo', 'TABLE', N'tb_stock';

-- 添加列注释
EXEC sp_addextendedproperty 
'MS_Description', N'库存对应的商品sku id', 'SCHEMA', N'dbo', 
'TABLE', N'tb_stock', 'COLUMN', N'sku_id';

EXEC sp_addextendedproperty 
'MS_Description', N'可秒杀库存', 'SCHEMA', N'dbo', 
'TABLE', N'tb_stock', 'COLUMN', N'seckill_stock';

EXEC sp_addextendedproperty 
'MS_Description', N'秒杀总数量', 'SCHEMA', N'dbo', 
'TABLE', N'tb_stock', 'COLUMN', N'seckill_total';

EXEC sp_addextendedproperty 
'MS_Description', N'库存数量', 'SCHEMA', N'dbo', 
'TABLE', N'tb_stock', 'COLUMN', N'stock';