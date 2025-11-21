package com.example.ecommerce_platform.mapper;

import com.example.ecommerce_platform.entity.SpuDetail;
import org.apache.ibatis.annotations.*;

@Mapper
public interface SpuDetailMapper {
    // 按照SPU ID查询
    @Select("select * from tb_spu_detail where spu_id = #{spuId}")
    SpuDetail findSpuDetailBySpuId(Long spuId);

    // 插入SPU详情
    @Insert("INSERT INTO tb_spu_detail(spu_id, description, generic_spec, special_spec, packing_list, after_service) " +
            "VALUES(#{spuId}, #{description}, #{genericSpec}, #{specialSpec}, #{packingList}, #{afterService})")
    int insertSpuDetail(SpuDetail spuDetail);

    // 更新SPU详情
    @Update("UPDATE tb_spu_detail SET description=#{description}, generic_spec=#{genericSpec}, special_spec=#{specialSpec}, " +
            "packing_list=#{packingList}, after_service=#{afterService} WHERE spu_id=#{spuId}")
    int updateSpuDetail(SpuDetail spuDetail);

    // 删除SPU详情
    @Delete("delete from tb_spu_detail where spu_id = #{spuId}")
    void deleteSpuDetailBySpuId(Long spuId);
}