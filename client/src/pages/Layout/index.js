import { Layout, Menu, Popconfirm } from 'antd'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  PlaySquareOutlined,
  LogoutOutlined,
  TeamOutlined
} from '@ant-design/icons'
import './index.scss'
import SearchBar from '@/components/SearchBar'

const { Header, Sider } = Layout

const MainLayout = () => {

  const { pathname } = useLocation()

  const handleLogoutConfirm = () => {
    window.location.href = '/login'
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">user.name</span>
          <span className="user-logout">
            <Popconfirm title="Log out?" okText="Yes" cancelText="No" onConfirm={handleLogoutConfirm}>
              <LogoutOutlined /> Logout
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={"/"}
            selectedKeys={pathname}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to='/'>Home</Link>
            </Menu.Item>
            <Menu.Item icon={<PlaySquareOutlined />} key="/movie">
              <Link to="/movie">Movie</Link>
            </Menu.Item>
            <Menu.Item icon={<TeamOutlined />} key="/crew">
              <Link to="/crew">Crew</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <SearchBar />
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout