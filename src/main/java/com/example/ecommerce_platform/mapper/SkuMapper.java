package com.example.ecommerce_platform.mapper;

import com.example.ecommerce_platform.entity.Sku;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SkuMapper {
    // 查询全部SKU
    @Select("select * from tb_sku")
    List<Sku> getSkus();

    // 按照ID查询
    @Select("select * from tb_sku where id = #{id}")
    Sku findSkuById(Long id);

    // 按照SPU ID查询
    @Select("select * from tb_sku where spu_id = #{spuId}")
    List<Sku> findSkusBySpuId(Long spuId);

    // 查询有效SKU
    @Select("select * from tb_sku where enable = 1")
    List<Sku> findEnabledSkus();

    // 删除SKU
    @Delete("delete from tb_sku where id = #{id}")
    void deleteSkuById(Long id);

    // 按照SPU ID删除SKU
    @Delete("delete from tb_sku where spu_id = #{spuId}")
    void deleteSkusBySpuId(Long spuId);

    // 统计总条数
    @Select("select count(*) from tb_sku")
    int getSkuCount();

    // 插入SKU
    @Insert("INSERT INTO tb_sku(id, spu_id, title, images, price, indexes, own_spec, enable, create_time, last_update_time) " +
            "VALUES(#{id}, #{spuId}, #{title}, #{images}, #{price}, #{indexes}, #{ownSpec}, #{enable}, #{createTime}, #{lastUpdateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertSku(Sku sku);

    // 更新SKU
    @Update("UPDATE tb_sku SET spu_id=#{spuId}, title=#{title}, images=#{images}, price=#{price}, indexes=#{indexes}, " +
            "own_spec=#{ownSpec}, enable=#{enable}, create_time=#{createTime}, last_update_time=#{lastUpdateTime} " +
            "WHERE id=#{id}")
    void updateSku(Sku sku);

    // 更新SKU启用状态
    @Update("UPDATE tb_sku SET enable=#{enable} WHERE id=#{id}")
    void updateSkuEnable(@Param("id") Long id, @Param("enable") Boolean enable);

    // 批量查询SKU
    @Select("<script>" +
            "select * from tb_sku where id in " +
            "<foreach collection='skuIds' item='id' open='(' separator=',' close=')'>" +
            "#{id}" +
            "</foreach>" +
            "</script>")
    List<Sku> findSkusByIds(@Param("skuIds") List<Long> skuIds);
}