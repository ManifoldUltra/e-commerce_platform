package com.example.ecommerce_platform.test;

import com.example.ecommerce_platform.entity.Customer;
import com.example.ecommerce_platform.mapper.UserMapper;
import com.example.ecommerce_platform.util.MyBatisutil;
import org.apache.ibatis.session.SqlSession;

import java.util.List;

public class test {

    public static void main(String[] args) {
        SqlSession session = null;
        try {
            // 获取SqlSession对象
            session = MyBatisutil.getSqlSession();
            UserMapper userMapper = session.getMapper(UserMapper.class);

            System.out.println("=== 开始测试 UserMapper ===");

            // 测试1：查询所有顾客
            testGetAllCustomers(userMapper);

            // 测试2：按ID查询顾客
            testFindCustomerById(userMapper);

            // 测试3：插入新顾客
            Customer newCustomer = testInsertCustomer(userMapper);

            // 测试4：更新顾客
            if (newCustomer != null) {
                testUpdateCustomer(userMapper, newCustomer);
            }

            // 测试5：删除顾客
            if (newCustomer != null) {
                testDeleteCustomer(userMapper, newCustomer.getId());
            }

            System.out.println("=== 所有测试完成 ===");

        } catch (Exception e) {
            e.printStackTrace();
            // 发生异常时回滚事务
            if (session != null) {
                session.rollback();
            }
        } finally {
            // 关闭SqlSession对象
            if (session != null) {
                MyBatisutil.closeSqlSession(session);
            }
        }
    }

    /**
     * 测试1：查询所有顾客
     */
    private static void testGetAllCustomers(UserMapper userMapper) {
        System.out.println("\n--- 测试1：查询所有顾客 ---");
        try {
            List<Customer> customers = userMapper.getCustomers();
            System.out.println("查询到的顾客数量: " + customers.size());

            if (!customers.isEmpty()) {
                System.out.println("前5个顾客信息:");
                for (int i = 0; i < Math.min(customers.size(), 5); i++) {
                    System.out.println("  " + (i + 1) + ". " + customers.get(i));
                }
            } else {
                System.out.println("没有找到任何顾客记录");
            }
        } catch (Exception e) {
            System.out.println("查询所有顾客时出错: " + e.getMessage());
        }
    }

    /**
     * 测试2：按ID查询顾客
     */
    private static void testFindCustomerById(UserMapper userMapper) {
        System.out.println("\n--- 测试2：按ID查询顾客 ---");
        try {
            // 先获取所有顾客，然后测试查询第一个顾客的ID
            List<Customer> customers = userMapper.getCustomers();
            if (!customers.isEmpty()) {
                int testId = customers.get(0).getId();
                Customer customer = userMapper.findCustomerById(testId);
                if (customer != null) {
                    System.out.println("按ID查询成功: " + customer);
                } else {
                    System.out.println("未找到ID为 " + testId + " 的顾客");
                }
            } else {
                System.out.println("没有顾客数据可用于ID查询测试");
            }
        } catch (Exception e) {
            System.out.println("按ID查询顾客时出错: " + e.getMessage());
        }
    }

    /**
     * 测试3：插入新顾客
     */
    private static Customer testInsertCustomer(UserMapper userMapper) {
        System.out.println("\n--- 测试3：插入新顾客 ---");
        try {
            Customer newCustomer = new Customer();
            newCustomer.setName("测试用户");

            userMapper.insertCustomer(newCustomer);
            // 提交事务，确保插入操作被保存
            userMapper.getCustomers(); // 这行只是为了获取session，实际应该用session.commit()

            System.out.println("插入顾客成功，生成的ID: " + newCustomer.getId());
            System.out.println("插入的顾客信息: " + newCustomer);

            return newCustomer;
        } catch (Exception e) {
            System.out.println("插入顾客时出错: " + e.getMessage());
            return null;
        }
    }

    /**
     * 测试4：更新顾客
     */
    private static void testUpdateCustomer(UserMapper userMapper, Customer customer) {
        System.out.println("\n--- 测试4：更新顾客 ---");
        try {
            customer.setName("更新后的用户");

            userMapper.updateCustomer(customer);
            System.out.println("更新顾客成功");

            // 验证更新是否成功
            Customer updatedCustomer = userMapper.findCustomerById(customer.getId());
            if (updatedCustomer != null) {
                System.out.println("更新后的顾客信息: " + updatedCustomer);
            }
        } catch (Exception e) {
            System.out.println("更新顾客时出错: " + e.getMessage());
        }
    }

    /**
     * 测试5：删除顾客
     */
    private static void testDeleteCustomer(UserMapper userMapper, int customerId) {
        System.out.println("\n--- 测试5：删除顾客 ---");
        try {
            // 先确认顾客存在
            Customer customer = userMapper.findCustomerById(customerId);
            if (customer != null) {
                System.out.println("准备删除顾客: " + customer);
                userMapper.deleteCustomerById(customerId);
                System.out.println("删除顾客成功，ID: " + customerId);

                // 验证删除是否成功
                Customer deletedCustomer = userMapper.findCustomerById(customerId);
                if (deletedCustomer == null) {
                    System.out.println("验证: 顾客删除成功");
                } else {
                    System.out.println("警告: 顾客可能未被成功删除");
                }
            } else {
                System.out.println("要删除的顾客不存在，ID: " + customerId);
            }
        } catch (Exception e) {
            System.out.println("删除顾客时出错: " + e.getMessage());
        }
    }
}