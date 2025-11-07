package com.example.ecommerce_platform;

import com.example.ecommerce_platform.Service.CustomerService;
import com.example.ecommerce_platform.entity.Result;
import com.example.ecommerce_platform.entity.Customer;
import com.example.ecommerce_platform.entity.Merchandise;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class TestController {

    @RequestMapping("/home")
    public String home(Model model){
        Customer C1 = new Customer();
        C1.setName("用户1");
        model.addAttribute("C1", C1);
        return "home";
    }

    @RequestMapping("/MerchandisePage")
    public String MerchandisePage(Model model){
        Customer C1 = new Customer();
        C1.setName("用户1");
        model.addAttribute("C1", C1);

        Merchandise M1 = new Merchandise();
        M1.setname("商品1");
        model.addAttribute("M1", M1);

        return "MerchandisePage";
    }

    @RequestMapping("/search-result")
    public String search_result(Model model){
        Customer C1 = new Customer();
        C1.setName("用户1");
        model.addAttribute("C1", C1);

        Merchandise M1 = new Merchandise();
        M1.setname("商品1");
        model.addAttribute("M1", M1);

        return "search-result";
    }

    @RequestMapping("/login")
    public String login(Model model){
        return "login";
    }
    @Autowired
    private CustomerService customerService1;
    @PostMapping("/login")

    @ResponseBody  // 需要添加这个注解，因为返回的是Result对象，而不是视图名称
    public Result login(Customer customer) {  // 去掉@RequestBody
        Customer e = customerService1.login(customer);
        System.out.println(customer);
        return e != null ? Result.success() : Result.error("用户名或密码错误");
    }

    @RequestMapping("/register")
    public String register(Model model){
        return "register";
    }
    @Autowired
    private CustomerService customerService2;
    @PostMapping("/register")

    @ResponseBody
    public Result register(Customer customer) {
        Customer e = customerService2.register(customer);
        System.out.println(customer);
        return e != null ? Result.success() : Result.error("错误");
    }
}
