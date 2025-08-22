import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, service, IEmbedConfiguration } from 'powerbi-client';

declare global {
  interface Window {
    report?: models.IReport;
  }
}

const PowerBIReact: React.FC = () => {
  const embedConfig: IEmbedConfiguration = {
    type: 'report',
    id: 'b647269a-0a92-4410-b237-d306af9c1544',
    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=b647269a-0a92-4410-b237-d306af9c1544&groupId=153882a9-b2c4-4db4-bfea-82ed06a7b36c',
    accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkpZaEFjVFBNWl9MWDZEQmxPV1E3SG4wTmVYRSIsImtpZCI6IkpZaEFjVFBNWl9MWDZEQmxPV1E3SG4wTmVYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTEwNGNiNjItOTU0Zi00YWE3LTg4MDQtMzgxMWI5ZjVhZjMwLyIsImlhdCI6MTc1NTc2Mzg1MiwibmJmIjoxNzU1NzYzODUyLCJleHAiOjE3NTU3Njg5NzQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84WkFBQUFOT0VWbExtWDF6RzNLa083U1JkcTRUdGg3bWlKTy93cTY0M1Vwdi9kUzhtQ3lTaDYyU3BsUmxJa0dpeTNpcnU2empHSzNqazlqQ3ppTXB2UU9wWllsNlJoQkJDSmN6d1pTTnZxYyt2aGhtbER1aGIxTE5TRXJkdlBEcU90VnVkd0J4YnNSVi9YOVg4N1ZDMThCaTBHcVE9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJmOGRlOGZlZS02MDgzLTQwYmItYTUzMC1jNzAwOTE2ZmY3M2MiLCJhcHBpZGFjciI6IjEiLCJnaXZlbl9uYW1lIjoiVGVjaFVzZXIiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyNDA5OjQwZjQ6MjAwZjphMGEwOjJjODc6Nzk3YjoyYTZiOjMyZDgiLCJuYW1lIjoiVGVjaFVzZXIiLCJvaWQiOiI4MDg5NTJiMy01ZjVlLTRlODMtOWI3My1mNGQyYzVkY2RhMzgiLCJwdWlkIjoiMTAwMzIwMDRDRDk2NEMwQiIsInJoIjoiMS5BY1lBWXNzRUVVLVZwMHFJQkRnUnVmV3ZNQWtBQUFBQUFBQUF3QUFBQUFBQUFBREdBSTNHQUEuIiwic2NwIjoiRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwiLCJzaWQiOiIwMDdkNGUzOS00OTAyLThhYTgtYjJmNi05MmU3YTUzZGQyNjEiLCJzdWIiOiIxbnU3eE8taUpveG9NZENUTEZOX3dRdzVVM092bmE0YjlKVk5hbFRVSkowIiwidGlkIjoiMTEwNGNiNjItOTU0Zi00YWE3LTg4MDQtMzgxMWI5ZjVhZjMwIiwidW5pcXVlX25hbWUiOiJ0ZWNodXNlckBrbGFydGRpZ2kuY29tIiwidXBuIjoidGVjaHVzZXJAa2xhcnRkaWdpLmNvbSIsInV0aSI6ImV3MlRtUWtVaVVPVFZqdHdzMWNIQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfZnRkIjoiM1RGeXM0R3ByMF9jeVNLR3FUdVV2eEFjXy1jNGlIM2FaUjM1Rm1LVEhab0JZWE5wWVhOdmRYUm9aV0Z6ZEMxa2MyMXoiLCJ4bXNfaWRyZWwiOiIxNCAxIn0.VH_xc5agnDuWElvOy-HkBmLYXWV59Hri1CDwPemDAzkGLKVF1abiG5iTmNVwP_vJs3zzVqHH41v_v0CmSa_j3cYbZUZR-cl8vBZWPAcMHagaEd193zmlVsR5K4AOsfRJbjGdCUebVWlkP-2yztN-T3LZ6ALjuGvBkj5-itcEo_rTKlTWHrpRmEQre7bBnKEqqn-ejm7PcenIcV_uPhApJx_l2oJ-EveY7r25i_c3no7DVb65FlW1bBAmlopUzhfXxAu3YG9p2OaRJYMFaMAuv7cIxXT9aXIEF8o19ukXqz4ySqTPQY31IykiJgm648FrD-c2E0OX1ZFLmAOFHXnebw',
    tokenType: models.TokenType.Aad,
    settings: {
      panes: {
        filters: {
          expanded: false,
          visible: false
        },
        pageNavigation: {
          visible: false
        }
      },
      background: models.BackgroundType.Transparent,
      layoutType: models.LayoutType.Custom,
      customLayout: {
        displayOption: models.DisplayOption.FitToPage
      }
    }
  };

  const handleLoaded = () => {
    console.log('PowerBI Report loaded successfully');
  };

  const handleRendered = () => {
    console.log('PowerBI Report rendered successfully');
  };

  const handleError = (event: any) => {
    console.error('PowerBI Report error:', event?.detail || event);
  };

  const handleVisualClicked = (event: any) => {
    console.log('PowerBI Visual clicked:', event);
  };

  const handlePageChanged = (event: any) => {
    console.log('PowerBI Page changed:', event);
  };

  const handleDataSelected = (event: any) => {
    console.log('PowerBI Data selected:', event);
  };

  const getEmbeddedComponent = (embeddedReport: service.Report) => {
    // Store the report instance globally for external access
    window.report = embeddedReport as models.IReport;
    
    // You can also perform additional setup here
    console.log('PowerBI Report component embedded successfully');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        background: '#f5f5f5',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <PowerBIEmbed
        embedConfig={embedConfig}
        eventHandlers={
          new Map([
            ['loaded', handleLoaded],
            ['rendered', handleRendered],
            ['error', handleError],
            ['visualClicked', handleVisualClicked],
            ['pageChanged', handlePageChanged],
            ['dataSelected', handleDataSelected]
          ])
        }
        cssClassName="powerbi-embed-container"
        getEmbeddedComponent={getEmbeddedComponent}
      />
    </div>
  );
};

export default PowerBIReact;