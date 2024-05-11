/* eslint-disable no-new-func */
export const evalVariableAndCodeFromContext = (code = '', context = {}) => {
  try {
    if (!code || !context) return ''
    const myFunction = new Function('context', code)
    const data = myFunction(context)
    return { message: data, success: true }
  } catch (error) {
    return { message: `Error:: ${error?.message}`, success: false }
  }
}
