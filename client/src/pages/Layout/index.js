import { Layout, Menu, Popconfirm } from 'antd'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HomeOutlined,
  PlaySquareOutlined,
  LogoutOutlined,
  TeamOutlined,
  BarChartOutlined,
  CameraOutlined
} from '@ant-design/icons'
import './index.scss'
import { useStore } from "@/store"

const { Header, Sider } = Layout

const MainLayout = () => {

  const { loginStore } = useStore()

  const { pathname } = useLocation()

  const handleLogoutConfirm = () => {
    window.location.href = '/'
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name" style={{ color: 'black' }}>{loginStore.token.username}</span>
          <span className="user-logout" style={{ color: 'black' }}>
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
              <Link to='/home'>Home</Link>
            </Menu.Item>
            <Menu.Item icon={<PlaySquareOutlined />} key="/movie">
              <Link to="/movie">Movie</Link>
            </Menu.Item>
            <Menu.Item icon={<TeamOutlined />} key="/actor">
              <Link to="/actor">Actor</Link>
            </Menu.Item>
            <Menu.Item icon={<CameraOutlined />} key="/director">
              <Link to="/director">Director</Link>
            </Menu.Item>
            <Menu.Item icon={<BarChartOutlined />} key="/funfacts">
              <Link to="/funfacts">Fun Facts</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default MainLayout