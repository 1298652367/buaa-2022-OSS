import Vue from 'vue';
import { Select, Modal, Icon, Checkbox, Menu, Message, Button, Dropdown, Input } from 'ant-design-vue';

Vue.use(Select);
Vue.use(Button);
Vue.use(Checkbox);
Vue.use(Dropdown);
Vue.use(Icon);
Vue.use(Menu);
Vue.use(Input);

Message.config({
  duration: 1.5,
});
Vue.prototype.$message = Message;
Vue.prototype.$confirm = Modal.confirm;
