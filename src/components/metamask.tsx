import { Button, Chip, Tooltip } from "@mui/material";
import { inject, observer } from 'mobx-react';
import { MetamaskStore } from "../store/metamask.store";



export const Metamask = inject('metamaskStore')(observer(({ metamaskStore }: { metamaskStore?: MetamaskStore }) => {
  return (
    <>
      {!!metamaskStore && (
        <Tooltip title={metamaskStore.account ? "Connected" : "Connect"}>
          {metamaskStore.account ? (
            <Chip label={metamaskStore.account} color="success" />
          ) : (
            <Button color="warning" onClick={() => metamaskStore.connect()} style={{ display: "flex", alignItems: "center" }}>
              <img src={`${process.env.PUBLIC_URL}/metamask.png`} alt="metamask.png" width={24} style={{ marginRight: "10px" }} />
              <span>
                CONNECT
              </span>
            </Button>
          )}
        </Tooltip>
      )}
    </>
  )
}));