import { OrderType } from '../types/FlowJson.ts'

export default function getStepOrderArray(order: OrderType) {
  const stepOrderArr: Array<string> = []
  const processNode = (nodeId: string) => {
    stepOrderArr.push(nodeId)

    if (order[nodeId]) {
      order[nodeId].forEach((childId) => {
        processNode(childId)
      })
    }
  }
  order?.root?.forEach((id) => {
    if (order?.[id]) processNode(id)
    else stepOrderArr.push(id)
  })
  return stepOrderArr
}
