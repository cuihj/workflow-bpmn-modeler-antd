<template>
  <div class="workflow-bpmn-modeler">
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :config="config"
      :users="users"
      :groups="groups"
      :categorys="categorys"
      :is-view="isView"
    />
  </div>
</template>

<script>
import bpmnModeler from '../package/index'
export default {
  components: {
    bpmnModeler
  },
  data() {
    return {
      xml: '', // 后端查询到的xml
      users: [],
      groups: [],
      categorys: [],
      isView: false,
      config:{
        image:true,
        api:true,
        revert:true,
        schema:true,
        form:true,
      },
    }
  },
  mounted() {
    window.addEventListener('message', event => {
      this.set(event.data)
    })
  },
  methods: {
    set(eventData) {
      this.xml = eventData.xml
      this.users = eventData.users ?? []
      this.groups = eventData.groups ?? []
      this.categorys = eventData.categorys ?? []
      this.config = eventData.config ?? {}
      this.isView = eventData.isView ?? false
    }
  }
}
</script>

<style lang="scss">
.workflow-bpmn-modeler {
  height: 100%;
  margin: 0;
}
</style>
