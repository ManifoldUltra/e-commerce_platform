package com.example.ecommerce_platform.util;

import java.io.IOException;
import java.io.InputStream;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

/**
 * 工具类
 *
 */
public class MyBatisutil {
    //创建SqlSessionFactory对象
    private static SqlSessionFactory factory;
    static{
        try {
            //获取配置文件资源
            InputStream inputStream=Resources.getResourceAsStream("com/example/ecommerce_platform/mybatis/conf.xml");
            // 先构建一个基础的 SqlSessionFactory（不解析 mapper）
            SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
            //获取SqlSessionFactory对象
            factory=new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 获取SqlSession对象
     */
    public static SqlSession getSqlSession(){
        return factory.openSession();
    }

    /**
     * 关闭SqlSession对象
     */
    public static void closeSqlSession(SqlSession session){
        if(null!=session){
            //关闭Sqlsession对象
            session.close();
        }
        session=null;
    }
}

