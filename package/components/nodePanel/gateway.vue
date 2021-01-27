<template>
  <div>
    <a-form :form="form" ref="xForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 16}">
      <a-form-item label="节点 id">
        <a-input v-decorator="['id', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
      </a-form-item>
      <a-form-item label="节点名称">
        <a-input v-decorator="['name', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
      </a-form-item>
      <a-form-item label="节点描述">
        <a-input v-decorator="['documentation', { rules: [{ required: true, message: 'Id 不能为空' }] }]"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import mixinPanel from '../../common/mixinPanel'
import mixinExecutionListener from '../../common/mixinExecutionListener'
import { commonParse } from '../../common/parseElement'
export default {
  mixins: [mixinPanel, mixinExecutionListener],
  data() {
    return {
      form: this.$form.createForm(this, {}),
      formData: {}
    }
  },
  computed: {
    formConfig() {
      return {
        inline: false,
        item: [
          {
            xType: 'input',
            name: 'id',
            label: '节点 id',
            rules: [{ required: true, message: 'Id 不能为空' }]
          },
          {
            xType: 'input',
            name: 'name',
            label: '节点名称'
          },
          {
            xType: 'colorPicker',
            name: 'color',
            label: '节点颜色'
          },
          {
            xType: 'input',
            name: 'documentation',
            label: '节点描述'
          },
          {
            xType: 'slot',
            name: 'executionListener',
            label: '执行监听器'
          },
          {
            xType: 'switch',
            name: 'async',
            label: '异步',
            activeText: '是',
            inactiveText: '否'
          }
        ]
      }
    }
  },
  watch: {
    'formData.async': function(val) {
      if (val === '') val = null
      this.updateProperties({ 'flowable:async': val })
    }
  },
  created() {
    this.formData = commonParse(this.element)
    console.log(this.formData)
    this.$nextTick(() => {
      this.form.setFieldsValue({
        id: this.formData.id,
        name: this.formData.name,
        documentation: this.formData.documentation
      })
    })
  }
}
</script>

<style>

</style>
