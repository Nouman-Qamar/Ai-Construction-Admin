import { Flex, Typography } from "antd";
import Search from "antd/es/input/Search";




function HeaderPage() {
  return (
    <Flex className="header" >
      <Typography.Title level={2} type="secondary">Admin-Dashboard </Typography.Title>

      <Flex align="center"  gap='3rem'>
        <Search placeholder="Search Here" allowClear />
        
      </Flex>
    </Flex>
  );
}

export default HeaderPage;