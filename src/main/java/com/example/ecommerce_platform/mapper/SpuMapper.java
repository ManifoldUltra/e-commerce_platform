package com.example.ecommerce_platform.mapper;

import com.example.ecommerce_platform.entity.Spu;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SpuMapper {
    // 查询全部SPU
    @Select("select * from tb_spu")
    List<Spu> getSpus();

    // 按照ID查询
    @Select("select * from tb_spu where id = #{id}")
    Spu findSpuById(Long id);

    // 按照分类查询
    @Select("select * from tb_spu where cid3 = #{categoryId}")
    List<Spu> findSpusByCategoryId(Long categoryId);

    // 按照品牌查询
    @Select("select * from tb_spu where brand_id = #{brandId}")
    List<Spu> findSpusByBrandId(Long brandId);

    // 查询上架商品
    @Select("select * from tb_spu where saleable = 1 and valid = 1")
    List<Spu> findSaleableSpus();

    // 删除SPU
    @Delete("delete from tb_spu where id = #{id}")
    void deleteSpuById(Long id);

    // 统计总条数
    @Select("select count(*) from tb_spu")
    int getSpuCount();

    // 插入SPU
    @Insert("INSERT INTO tb_spu(id, title, sub_title, cid1, cid2, cid3, brand_id, saleable, valid, create_time, last_update_time) " +
            "VALUES(#{id}, #{title}, #{subTitle}, #{cid1}, #{cid2}, #{cid3}, #{brandId}, #{saleable}, #{valid}, #{createTime}, #{lastUpdateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertSpu(Spu spu);

    // 更新SPU
    @Update("UPDATE tb_spu SET title=#{title}, sub_title=#{subTitle}, cid1=#{cid1}, cid2=#{cid2}, cid3=#{cid3}, " +
            "brand_id=#{brandId}, saleable=#{saleable}, valid=#{valid}, create_time=#{createTime}, last_update_time=#{lastUpdateTime} " +
            "WHERE id=#{id}")
    int updateSpu(Spu spu);

    // 更新上架状态
    @Update("UPDATE tb_spu SET saleable=#{saleable} WHERE id=#{id}")
    void updateSpuSaleable(@Param("id") Long id, @Param("saleable") Boolean saleable);

    // 分页查询
    @Select("SELECT * FROM tb_spu ORDER BY create_time DESC OFFSET #{start} ROWS FETCH NEXT #{pageSize} ROWS ONLY")
    List<Spu> findSpusByPage(@Param("start") int start, @Param("pageSize") int pageSize);
}