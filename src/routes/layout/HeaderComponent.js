import BaseComponent from '../../components/core/BaseComponent';
import { Row, Col } from 'antd';
import styleObj from './HeaderComponent.scss'

class HeaderComponent extends BaseComponent {
  render () {
    return (
      <div className={styleObj.HeaderComponent}>
        <Row>
          <Col span={12} className={styleObj.home} onClick={this.goPage.bind(this, "home")} className={styleObj.home}>
            Home
          </Col>
          <Col span={12} className={styleObj.home} onClick={this.goPage.bind(this, "his")} className={styleObj.history}>
            History
          </Col>
        </Row>
      </div>
    );
  }

}

export default HeaderComponent;
