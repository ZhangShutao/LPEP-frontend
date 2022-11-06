<template>
  <div>
    <!--侧边栏菜单-->
    <el-menu
      class="sidebar-el-menu"
      :collapse="isCollapse"
      router>
      <template v-for="item in menulist">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-menu-item
                :index="subItem.index"
                :key="subItem.index"
              >{{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'UserSideBar',
  data () {
    return {
      isCollapse: false,
      menulist: [
        {
          index: '1',
          title: '用户',
          icon: 'el-icon-user',
          subs: [
            {
              index: '/user/info',
              title: '基本信息'
            }
          ]
        },
        {
          index: '2',
          title: '实验',
          icon: 'el-icon-edit',
          subs: [
            {
              index: '/user/experiment-to-do',
              title: '待参与实验'
            }
          ]
        },
        {
          index: '3',
          title: '培训',
          icon: 'el-icon-tickets',
          subs: [
            {
              index: 'textbook-download',
              title: '自学培训教材下载'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
</style>
