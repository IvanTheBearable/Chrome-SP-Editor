import { ILogEntry } from '@pnp/logging'
import * as pnp from '@pnp/pnpjs'
import { IWebProperty } from './../../../store/webproperties/types'

// we cannot use async methods, they do not work correctly when running 'npm run build',
// async methods works when running 'npm run watch'
export function deleteWebProperties(...args: any) {

  /* get parameters */
  const params = args
  const functionName = params[0].name
  const webprops: IWebProperty[] = JSON.parse(decodeURIComponent(params[1]).replace(/%27/g, "'"));

  /* import pnp */
  (window as any).SystemJS.import(((window as any).speditorpnp)).then(($pnp: typeof pnp) => {
    /*** setup pnp ***/
    $pnp.setup({
      sp: {
        headers: {
          Accept: 'application/json; odata=verbose',
        },
      },
    })
    /*** clear previous log listeners ***/
    $pnp.log.clearSubscribers()
    /*** setup log listener ***/
    const listener = new $pnp.FunctionListener((entry: ILogEntry) => {
      entry.data.response.clone().json().then((error: any) => {
        window.postMessage(JSON.stringify({
          function: functionName,
          success: false,
          result: null,
          errorMessage: error.error.message.value,
          source: 'chrome-sp-editor',
        }), '*')
      })
    })
    $pnp.log.subscribe(listener)
    /* *** */

    const postMessage = () => {
      window.postMessage(JSON.stringify({
        function: functionName,
        success: true,
        result: [],
        errorMessage: '',
        source: 'chrome-sp-editor',
      }), '*')
    }

    const promises: any[] = []

    webprops.forEach(prop => {

      $pnp.sp.site.select('Id')().then((site) => {
        const siteid = site.Id
        $pnp.sp.web.select('Id')().then((web) => {
          const webid = web.Id

          const endpoint = _spPageContextInfo.webAbsoluteUrl + '/_vti_bin/client.svc/ProcessQuery'
          const payload = `
            <Request xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="SPEditor">
              <Actions>
                <Method Name="SetFieldValue" Id="9" ObjectPathId="4">
                  <Parameters>
                    <Parameter Type="String">${prop.key}</Parameter>
                    <Parameter Type="Null" />
                  </Parameters>
                </Method>
                <Method Name="Update" Id="10" ObjectPathId="2" />
              </Actions>
              <ObjectPaths>
                <Identity Id="2" Name="740c6a0b-85e2-48a0-a494-e0f1759d4aa7:site:${siteid}:web:${webid}" />
                <Property Id="4" ParentId="2" Name="AllProperties" />
              </ObjectPaths>
            </Request>`

          const client = new $pnp.SPNS.SPHttpClient()
          promises.push(client.post(endpoint, {
            headers: {
              Accept: '*/*',
              'Content-Type': 'text/xml;charset="UTF-8"',
              'X-Requested-With': 'XMLHttpRequest',
            },
            body: payload,
          })
            .then((r) => r.json()))
            // .then((r) => {
              // remove from indexed also
            // })

        })
      })

    })
    Promise.all(promises).then(postMessage)

  })
}