package com.example.ecommerce_platform.Service;

import com.example.ecommerce_platform.entity.Customer;
import com.example.ecommerce_platform.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {
    @Autowired
    private UserMapper UserMapper;

    public Customer login(Customer customer) {
        Customer e = UserMapper.getByUsernameAndPassword(customer);
//        System.out.println(e);
        return e;
    }
    public Customer register(Customer customer) {
        int sum=UserMapper.getsumCustomer();
        int id=sum+1;
        System.out.println(id);
        customer.setId(id);
        Customer e = UserMapper.insertCustomer(customer);
        System.out.println(e);
        return e;
    }
}
