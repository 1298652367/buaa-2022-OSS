import Vue from 'vue';
import { Modal, Popover, Switch, Select, Pagination, Tabs, Input, FormModel, Button, Alert, Table, Message, Card, Row, Col } from 'ant-design-vue';

Vue.use(Modal);
Vue.use(Popover);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Pagination);
Vue.use(Tabs);
Vue.use(Input);
Vue.use(FormModel);
Vue.use(Button);
Vue.use(Alert);
Vue.use(Table);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);

Vue.prototype.$confirm = Modal.confirm;
Message.config({
  duration: 1.5,
});
Vue.prototype.$message = Message;
