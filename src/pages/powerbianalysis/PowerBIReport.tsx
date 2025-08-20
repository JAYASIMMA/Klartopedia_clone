import React, { useEffect, useRef, useState } from 'react';

// Types for Power BI
interface PowerBIConfig {
  type: string;
  tokenType: number;
  accessToken: string;
  embedUrl: string;
  id: string;
  filters?: any[];
  settings?: any;
}

interface PowerBIPage {
  name: string;
  isActive: boolean;
}

interface PowerBIReport {
  off: (event: string) => void;
  on: (event: string, callback: Function) => void;
  getPages: () => Promise<PowerBIPage[]>;
  getFilters: () => Promise<any[]>;
  bookmarksManager: {
    capture: () => Promise<any>;
  };
}

declare global {
  interface Window {
    powerbi: {
      models: {
        TokenType: {
          Embed: number;
        };
        LayoutType: {
          MobilePortrait: number;
        };
      };
      service: {
        Service: new (
          hpmFactory: any,
          wpmpFactory: any,
          routerFactory: any
        ) => {
          embed: (element: HTMLElement, config: PowerBIConfig) => PowerBIReport;
        };
      };
      factories: {
        hpmFactory: any;
        wpmpFactory: any;
        routerFactory: any;
      };
    };
  }
}

const PowerBIReact: React.FC = () => {
  const embeddedReportRef = useRef<HTMLDivElement>(null);
  const [powerBIToken, setPowerBIToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const intervalRef = useRef<NodeJS.Timeout>();

  // Your REST API access token (in production, fetch this securely from your backend)
  const ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IkpZaEFjVFBNWl9MWDZEQmxPV1E3SG4wTmVYRSIsImtpZCI6IkpZaEFjVFBNWl9MWDZEQmxPV1E3SG4wTmVYRSJ9.eyJhdWQiOiJodHRwczovL2FuYWx5c2lzLndpbmRvd3MubmV0L3Bvd2VyYmkvYXBpIiwiaXNzIjoiaHR0cHM6Ly9zdHMud2luZG93cy5uZXQvMTEwNGNiNjItOTU0Zi00YWE3LTg4MDQtMzgxMWI5ZjVhZjMwLyIsImlhdCI6MTc1NTU5ODc1OCwibmJmIjoxNzU1NTk4NzU4LCJleHAiOjE3NTU2MDI5ODQsImFjY3QiOjAsImFjciI6IjEiLCJhaW8iOiJBWFFBaS84WkFBQUF5aDFrYm83YXR4K1hwQXdHTWw5YTVBdXV3MzdTQlFYM01idDExWVM3K01yR1BmWFlTM3kwTEVTdFMrSzVTNTVxUVVRQ2pzcE9Zd0Q0bTFGS1FmVGxkTUl4L2piY1k0QXkxTm5LemZTTlJ6UUpVNjMxeW5SRlhsU3pmOFZRRnRPZGswRzVNYnNTSnBjVFN0MFZGOVJQQWc9PSIsImFtciI6WyJwd2QiXSwiYXBwaWQiOiJmOGRlOGZlZS02MDgzLTQwYmItYTUzMC1jNzAwOTE2ZmY3M2MiLCJhcHBpZGFjciI6IjEiLCJnaXZlbl9uYW1lIjoiVGVjaFVzZXIiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyNDA5OjQwZjQ6MjAxNDo2M2M5OjVjYTc6ODYxYjo4MDgxOmM2YzciLCJuYW1lIjoiVGVjaFVzZXIiLCJvaWQiOiI4MDg5NTJiMy01ZjVlLTRlODMtOWI3My1mNGQyYzVkY2RhMzgiLCJwdWlkIjoiMTAwMzIwMDRDRDk2NEMwQiIsInJoIjoiMS5BY1lBWXNzRUVVLVZwMHFJQkRnUnVmV3ZNQWtBQUFBQUFBQUF3QUFBQUFBQUFBREdBSTNHQUEuIiwic2NwIjoiRGF0YXNldC5SZWFkLkFsbCBEYXRhc2V0LlJlYWRXcml0ZS5BbGwiLCJzaWQiOiIwMDdkMDAxOS01ZmY4LTg0NWQtMzI0OC0zZjUzZWUwYzgyMjkiLCJzdWIiOiIxbnU3eE8taUpveG9NZENOTEZOX3dRdzVVM092bmE0YjlKVk5hbFRVSkowIiwidGlkIjoiMTEwNGNiNjItOTU0Zi00YWE3LTg4MDQtMzgxMWI5ZjVhZjMwIiwidW5pcXVlX25hbWUiOiJ0ZWNodXNlckBrbGFydGRpZ2kuY29tIiwidXBuIjoidGVjaHVzZXJAa2xhcnRkaWdpLmNvbSIsInV0aSI6Ik8xNFAySmNGMkVTOXpIWnpQajh0QUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfZnRkIjoiSkNJVDFMRG5BY1VrOTY5OFQyTTdNMFdxSDMyTFpqcktiZVlCOHdqcmVuVUJZWE5wWVhOcGRYUm9aV0Z6ZEMxa2MyMXoiLCJ4bXNfaWRyZWwiOiIxIDI4In0.Vc2m9XDQQfdJzS4BpA4duUi_yf8vI5SF7dI1sTtgMUXYutOcwWumwxBGClfNFeRYtL1hVBFZNJWy-c5mFEPzeTxz8ZbdsI3tOiuEP3YK1wyIjWaIvK7i7iLWbIKOI7cK5yBA3dn_JvDTlBk7spKD5nvo4nItR4llS_W5KmkZt2GsPAaAm0bFRh_SVe_DeuZNGWHFBixjHcR9z5tW6z9Iqw18GGV56KWc59QS5XM3N3EkxkkK6xBxa485t0SfpGRCTqDuArOPH9FVqRoWw5u9tWlc1KX1U9lhXMaLbopbUmlI4AZlIfHTdbgftwx_DA7nsRDCNq7NOdU6HIR_wxcY6g';

  // Power BI Configuration
  const GROUP_ID = '153882a9-b2c4-4db4-bfea-82ed06a7b36c';
  const REPORT_ID = 'b647269a-0a92-4410-b237-d306af9c1544';
  const EMBED_URL = `https://app.powerbi.com/reportEmbed?reportId=${REPORT_ID}&groupId=${GROUP_ID}&w=2&config=...`;

  // Mobile detection utility
  const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Load Power BI JavaScript SDK
  const loadPowerBIScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.powerbi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/powerbi-client@2.22.1/dist/powerbi.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Power BI SDK'));
      document.head.appendChild(script);
    });
  };

  // Equivalent of getBIToken() - In your case, you already have the token
  const getBIToken = async (): Promise<void> => {
    try {
      // In production, you would fetch this from your backend API
      // const response = await fetch('/api/powerbi/token');
      // const data = await response.json();
      // const token = data[0]?.access_token;
      
      // For now, using the provided token directly
      if (ACCESS_TOKEN) {
        setPowerBIToken(ACCESS_TOKEN);
        setError('');
      } else {
        throw new Error('No access token available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get Power BI token');
      console.error('Error getting BI Token:', err);
    }
  };

  // Equivalent of showReport()
  const showReport = async (): Promise<void> => {
    if (!embeddedReportRef.current || !powerBIToken) return;

    try {
      await loadPowerBIScript();

      const embedReport = (
        embedUrl: string,
        reportId: string,
        filters: any[] = [],
        settings: any = {}
      ) => {
        const config: PowerBIConfig = {
          type: 'report',
          tokenType: window.powerbi.models.TokenType.Embed,
          accessToken: powerBIToken,
          embedUrl: embedUrl,
          id: reportId,
          filters: filters,
          settings: settings,
        };

        const powerbiService = new window.powerbi.service.Service(
          window.powerbi.factories.hpmFactory,
          window.powerbi.factories.wpmpFactory,
          window.powerbi.factories.routerFactory
        );

        const report = powerbiService.embed(embeddedReportRef.current!, config);

        // Remove existing event listeners
        report.off('loaded');

        // Add event listeners
        report.on('loaded', () => {
          console.log('Loaded report');
          setIsLoading(false);
        });

        report.on('pageChanged', (event) => {
          report.getPages().then((pages) => {
            const activePage = pages.find((page) => page.isActive);
            if (activePage) {
              const pageName = activePage.name;
              const newUrl = `${window.location.origin}/reports/${reportId}`;
              
              console.log('Page changed to:', pageName);
              console.log('Current URL:', newUrl);
              
              // Update the browser's URL without reloading the page
              window.history.pushState({ page: pageName }, '', newUrl);
            }
          });
        });

        report.on('dataSelected', (event) => {
          console.log('Data selection occurred (Slicer/Visual)');
          
          // Retrieve the current filters
          report.getFilters().then((filters) => {
            console.log('Current Filters:', filters);
            
            // Capture and log the bookmark state when a slicer is selected
            report.bookmarksManager.capture().then((bookmark) => {
              console.log('Current Bookmark State:', bookmark);
            });

            report.getPages().then((pages) => {
              const activePage = pages.find(page => page.isActive);
              if (activePage) {
                const pageName = activePage.name;
                const newUrl = `${window.location.origin}/reports/${reportId}`;
                console.log('Updated URL with Filters Applied:', newUrl);
              }
            });
          });
        });

        report.on('error', (event) => {
          console.error('Power BI Report Error:', event);
          setError('Error loading Power BI report');
          setIsLoading(false);
        });
      };

      // Embed configuration
      const embedConfig: any = {
        localeSettings: {
          language: "en",
          formatLocale: "en-IN"
        }
      };

      if (isMobile()) {
        embedConfig.layoutType = window.powerbi.models.LayoutType.MobilePortrait;
        embedConfig.filterPaneEnabled = false;
      }

      // Embed the report
      embedReport(
        `https://app.powerbi.com/reportEmbed?reportId=${REPORT_ID}&ctid=1104cb62-954f-4aa7-8804-3811b9f5af30`,
        REPORT_ID,
        [],
        embedConfig
      );

    } catch (err) {
      console.error('Error showing report:', err);
      setError('Failed to load Power BI report');
      setIsLoading(false);
    }
  };

  // Equivalent of ngAfterViewInit
  useEffect(() => {
    const initializePowerBI = async () => {
      try {
        await getBIToken();
        
        // Set up token refresh interval (30 minutes)
        intervalRef.current = setInterval(() => {
          getBIToken();
        }, 30 * 60 * 1000);

        // Equivalent of setTimeout for daterefresh (100ms delay)
        setTimeout(() => {
          // Add your date refresh logic here if needed
          console.log('Date refresh triggered');
        }, 100);
        
      } catch (err) {
        console.error('Failed to initialize Power BI:', err);
        setError('Failed to initialize Power BI');
        setIsLoading(false);
      }
    };

    initializePowerBI();

    // Cleanup function (equivalent to ngOnDestroy)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Effect to show report when token is available
  useEffect(() => {
    if (powerBIToken) {
      showReport();
    }
  }, [powerBIToken]);

  return (
    <div className="w-full h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Power BI Report - React + Vite</h1>
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Power BI Report...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p><strong>Error:</strong> {error}</p>
          <button
            onClick={() => {
              setError('');
              setIsLoading(true);
              getBIToken();
            }}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Power BI Report Container */}
      <div
        ref={embeddedReportRef}
        className={`w-full border border-gray-300 rounded-lg ${isLoading ? 'hidden' : 'block'}`}
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {/* Power BI report will be embedded here */}
      </div>

      {/* Debug Info */}
      <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
        <p><strong>Report ID:</strong> {REPORT_ID}</p>
        <p><strong>Group ID:</strong> {GROUP_ID}</p>
        <p><strong>Token Status:</strong> {powerBIToken ? 'Available' : 'Not Available'}</p>
        <p><strong>Mobile View:</strong> {isMobile() ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default PowerBIReact;