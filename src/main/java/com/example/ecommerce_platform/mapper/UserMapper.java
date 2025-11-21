package com.example.ecommerce_platform.mapper;

import com.example.ecommerce_platform.entity.Customer;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface UserMapper{
//    查询全部顾客
    @Select("select *  from Customers")
    List<Customer> getCustomers();
//    按照ID查询
    @Select("select * from Customers  where id=#{id}")
    Customer findCustomerById(int id);
//    删除顾客
    @Delete("delete  from Customers  where id=#{id}")
    void deleteCustomerById(int id);


    // 统计总条数，用于注册
    @Select("select count(*) from Customers")
    int getsumCustomer();

    // 新增：插入顾客用于测试
    @Insert("INSERT INTO Customers(id, name, password) VALUES(#{id}, #{name}, #{password})")
//    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertCustomer(Customer customer);
    // 新增：更新顾客
    @Update("UPDATE Customers SET name=#{name}, password=#{password} WHERE id=#{id}")
    void updateCustomer(Customer customer);

    // 查询用户名与密码
    @Select("select * from Customers  where name=#{name} and password=#{password}")
    Customer getByUsernameAndPassword(Customer customer);
}
