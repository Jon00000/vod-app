import { Router, Route, Switch } from 'dva/router';
import BaseComponent from '../../components/core/BaseComponent';
import HeaderComponent from '../layout/HeaderComponent'
import HistoryVediosComponent from './vedio/HistoryVediosComponent'
import LatestVediosComponent from './vedio/LatestVediosComponent'
import PlayerVediosComponent from './vedio/PlayerVediosComponent'
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

class IndexPage extends BaseComponent {
  // 构造函数

  render () {

    return (
      <>
        <HeaderComponent {...this.props}></HeaderComponent>
        <Switch>
          <Route path="/home" exact component={LatestVediosComponent} />
          <Route path="/his" exact component={HistoryVediosComponent} />
          <Route path="/player" exact component={PlayerVediosComponent} />
        </Switch>
      </>
    );
  }

}

export default IndexPage;
