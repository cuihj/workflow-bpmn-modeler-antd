<template>
  <div id="app">
    <bpmn-modeler
      ref="refNode"
      :xml="xml"
      :users="users"
      :groups="groups"
      :template-names="templateNames"
      :is-view="false"
      @save="saveModeler"
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
      users: [
        { name: '张三', id: 'zhangsan' },
        { name: '李四', id: 'lisi' },
        { name: '王五', id: 'wangwu' }
      ],
      groups: [
        { name: 'web组', id: 'web' },
        { name: 'java组', id: 'java' },
        { name: 'python组', id: 'python' }
      ],
      categorys: [
        { name: 'OA', id: 'oa' },
        { name: '财务', id: 'finance' }
      ],
      templateNames:[ { name: '模板1', id: 't1',text:'' },
        { name: '模板2', id: 't2',text:'' }],
    }
  },
  mounted() {
    this.getModelDetail()
  },
  methods: {
    getModelDetail() {
      fetch('https://cdn.jsdelivr.net/gh/goldsubmarine/workflow-bpmn-modeler@master/src/Leave.bpmn20.xml')
        .then(response => {
          return response.text()
        }).then(xml => {
          // this.xml = xml
          this.templateNames = [
            {id:'1',name:'模板1',text: this.createXml() },
            {id:'2',name:'模板2',text: this.createXml()  },

          ]
        })
    },
    createXml(id) {
      return `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:bioc="http://bpmn.io/schema/bpmn/biocolor/1.0" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" targetNamespace="http://www.flowable.org/processdef">
      <process id="{processId}" name=""  flowable:templateId="{templateId}">
        <startEvent id="startNode1" name="开始" />
      </process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_flow">
        <bpmndi:BPMNPlane id="BPMNPlane_flow" bpmnElement="T-2d89e7a3-ba79-4abd-9f64-ea59621c258c">
          <bpmndi:BPMNShape id="BPMNShape_startNode1" bpmnElement="startNode1" bioc:stroke="">
            <omgdc:Bounds x="240" y="200" width="30" height="30" />
            <bpmndi:BPMNLabel>
              <omgdc:Bounds x="242" y="237" width="23" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </definitions>
    `
    },
    saveModeler(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
html, body, #app {
  // height: 650px;
  margin: 0;
}
</style>
