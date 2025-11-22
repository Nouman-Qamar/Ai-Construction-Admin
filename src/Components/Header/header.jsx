import { Flex, Typography } from "antd";
import Search from "antd/es/input/Search";
import {MessageOutlined, NotificationOutlined} from "@ant-design/icons";



function HeaderPage() {
  return (
    <Flex className="header" >
      <Typography.Title level={2} type="secondary">Dashboard </Typography.Title>

      <Flex align="center"  gap='3rem'>
        <Search placeholder="Search Here" allowClear />
        <Flex align="center"  gap='10px'>
          <MessageOutlined  className="header-icon"/>
          <NotificationOutlined  className="header-icon"/>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default HeaderPage;