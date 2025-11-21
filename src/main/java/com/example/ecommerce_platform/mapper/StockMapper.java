package com.example.ecommerce_platform.mapper;

import com.example.ecommerce_platform.entity.Stock;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StockMapper {
    // 按照SKU ID查询库存
    @Select("select * from tb_stock where sku_id = #{skuId}")
    Stock findStockBySkuId(Long skuId);

    // 查询库存不足的商品
    @Select("select * from tb_stock where stock < #{minStock}")
    List<Stock> findLowStockItems(@Param("minStock") Integer minStock);

    // 插入库存
    @Insert("INSERT INTO tb_stock(sku_id, seckill_stock, seckill_total, stock) " +
            "VALUES(#{skuId}, #{seckillStock}, #{seckillTotal}, #{stock})")
    int insertStock(Stock stock);

    // 更新库存
    @Update("UPDATE tb_stock SET seckill_stock=#{seckillStock}, seckill_total=#{seckillTotal}, stock=#{stock} " +
            "WHERE sku_id=#{skuId}")
    void updateStock(Stock stock);

    // 减少库存
    @Update("UPDATE tb_stock SET stock = stock - #{quantity} WHERE sku_id = #{skuId} AND stock >= #{quantity}")
    int decreaseStock(@Param("skuId") Long skuId, @Param("quantity") Integer quantity);

    // 增加库存
    @Update("UPDATE tb_stock SET stock = stock + #{quantity} WHERE sku_id = #{skuId}")
    int increaseStock(@Param("skuId") Long skuId, @Param("quantity") Integer quantity);

    // 减少秒杀库存
    @Update("UPDATE tb_stock SET seckill_stock = seckill_stock - #{quantity} WHERE sku_id = #{skuId} AND seckill_stock >= #{quantity}")
    int decreaseSeckillStock(@Param("skuId") Long skuId, @Param("quantity") Integer quantity);

    // 批量查询库存
    @Select("<script>" +
            "select * from tb_stock where sku_id in " +
            "<foreach collection='skuIds' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<Stock> findStocksBySkuIds(@Param("skuIds") List<Long> skuIds);

    // 删除库存记录
    @Delete("delete from tb_stock where sku_id = #{skuId}")
    void deleteStockBySkuId(Long skuId);
}
