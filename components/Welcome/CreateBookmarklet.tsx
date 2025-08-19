'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Button,
  Text,
  Title,
  Code,
  Paper,
  Stack,
  Alert,
  Collapse,
  Group,
} from '@mantine/core';
import {
  IconInfoCircle,
  IconCopy,
  IconChevronDown,
  IconChevronRight,
} from '@tabler/icons-react';
import classes from './Welcome.module.css';

export function CreateBookmarklet() {
  const [bookmarkletCode, setBookmarkletCode] = useState('');
  const [codeExpanded, setCodeExpanded] = useState(false);
  const anchorRef = useRef<HTMLAnchorElement>(null);

  const generateBookmarklet = () => {
    const code = `javascript:(function(){
      if(window.axe){runAccessibilityCheck();return;}
      var script=document.createElement('script');
      script.src='https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.3/axe.min.js';
      script.onload=runAccessibilityCheck;
      script.onerror=function(){alert('Failed to load axe-core')};
      document.head.appendChild(script);
      
      function runAccessibilityCheck(){
        axe.run(function(err,results){
          if(err){alert('Error: '+err.message);return;}
          createOverlay(results);
        });
      }
      
      function createOverlay(results){
        var existing=document.getElementById('axe-overlay');
        if(existing)existing.remove();
        
        var overlay=document.createElement('div');
        overlay.id='axe-overlay';
        overlay.style.position='fixed';
        overlay.style.top='0';
        overlay.style.left='0';
        overlay.style.right='0';
        overlay.style.bottom='0';
        overlay.style.background='rgba(0,0,0,0.8)';
        overlay.style.zIndex='10000';
        overlay.style.fontFamily='Arial,sans-serif';
        overlay.style.color='white';
        overlay.style.overflowY='auto';
        overlay.style.padding='20px';
        overlay.style.boxSizing='border-box';
        
        var header=document.createElement('div');
        header.style.display='flex';
        header.style.justifyContent='space-between';
        header.style.alignItems='center';
        header.style.marginBottom='20px';
        header.style.paddingBottom='15px';
        header.style.borderBottom='1px solid #444';
        
        var title=document.createElement('h2');
        title.textContent='Accessibility Results ('+results.violations.length+' violations, '+results.passes.length+' passes)';
        title.style.margin='0';
        title.style.fontSize='24px';
        title.style.fontWeight='600';
        
        var closeBtn=document.createElement('button');
        closeBtn.textContent='×';
        closeBtn.style.background='#e74c3c';
        closeBtn.style.border='none';
        closeBtn.style.color='white';
        closeBtn.style.fontSize='24px';
        closeBtn.style.width='40px';
        closeBtn.style.height='40px';
        closeBtn.style.borderRadius='50%';
        closeBtn.style.cursor='pointer';
        closeBtn.onclick=function(){overlay.remove()};
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        var actions=document.createElement('div');
        actions.style.display='flex';
        actions.style.gap='10px';
        actions.style.marginBottom='20px';
        
        var downloadBtn=document.createElement('button');
        downloadBtn.innerHTML='⬇ Download JSON';
        downloadBtn.style.background='#3498db';
        downloadBtn.style.border='none';
        downloadBtn.style.color='white';
        downloadBtn.style.padding='10px 20px';
        downloadBtn.style.borderRadius='5px';
        downloadBtn.style.cursor='pointer';
        downloadBtn.onclick=function(){downloadJSON(results)};
        
        var copyBtn=document.createElement('button');
        copyBtn.innerHTML='📋 Copy JSON';
        copyBtn.style.background='#27ae60';
        copyBtn.style.border='none';
        copyBtn.style.color='white';
        copyBtn.style.padding='10px 20px';
        copyBtn.style.borderRadius='5px';
        copyBtn.style.cursor='pointer';
        copyBtn.onclick=function(){copyJSON(results)};
        
        var appBtn=document.createElement('button');
        appBtn.innerHTML='🏠 Open App';
        appBtn.style.background='#9b59b6';
        appBtn.style.border='none';
        appBtn.style.color='white';
        appBtn.style.padding='10px 20px';
        appBtn.style.borderRadius='5px';
        appBtn.style.cursor='pointer';
        appBtn.onclick=function(){window.open('http://localhost:3000/','_blank')};
        
        actions.appendChild(downloadBtn);
        actions.appendChild(copyBtn);
        actions.appendChild(appBtn);
        
        var content=document.createElement('div');
        
        if(results.violations.length===0){
          var noViolations=document.createElement('div');
          noViolations.style.background='#27ae60';
          noViolations.style.padding='20px';
          noViolations.style.borderRadius='8px';
          noViolations.style.textAlign='center';
          noViolations.innerHTML='<h3 style="margin:0 0 10px 0;color:white">🎉 No Violations Found!</h3><p style="margin:0;color:#d5f4e6">This page appears accessible.</p>';
          content.appendChild(noViolations);
        }else{
          var violationsTitle=document.createElement('h3');
          violationsTitle.textContent='Violations:';
          violationsTitle.style.color='#e74c3c';
          violationsTitle.style.margin='20px 0 15px 0';
          violationsTitle.style.fontSize='20px';
          content.appendChild(violationsTitle);
          
          for(var i=0;i<results.violations.length;i++){
            var violation=results.violations[i];
            var violationDiv=document.createElement('div');
            violationDiv.style.background='#2c3e50';
            violationDiv.style.padding='15px';
            violationDiv.style.borderRadius='8px';
            violationDiv.style.marginBottom='15px';
            violationDiv.style.borderLeft='4px solid #e74c3c';
            violationDiv.innerHTML='<h4 style="margin:0 0 10px 0;color:#e74c3c">'+violation.id+': '+violation.help+'</h4><p style="margin:0 0 10px 0;color:#bdc3c7">'+violation.description+'</p><p style="margin:0 0 10px 0;color:#95a5a6;font-size:14px"><strong>Impact:</strong> '+violation.impact+' | <strong>Tags:</strong> '+violation.tags.join(', ')+'</p><p style="margin:0;color:#95a5a6;font-size:14px"><strong>Elements:</strong> '+violation.nodes.length+' affected</p>';
            content.appendChild(violationDiv);
          }
        }
        
        if(results.passes.length>0){
          var passesTitle=document.createElement('h3');
          passesTitle.textContent='Passes:';
          passesTitle.style.color='#27ae60';
          passesTitle.style.margin='20px 0 15px 0';
          passesTitle.style.fontSize='20px';
          content.appendChild(passesTitle);
          
          var passesSummary=document.createElement('div');
          passesSummary.style.background='#2c3e50';
          passesSummary.style.padding='15px';
          passesSummary.style.borderRadius='8px';
          passesSummary.style.marginBottom='15px';
          passesSummary.style.borderLeft='4px solid #27ae60';
          passesSummary.innerHTML='<p style="margin:0;color:#bdc3c7">'+results.passes.length+' checks passed.</p>';
          content.appendChild(passesSummary);
        }
        
        overlay.appendChild(header);
        overlay.appendChild(actions);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        overlay.focus();
        
        var handleEscape=function(e){
          if(e.key==='Escape'){
            overlay.remove();
            document.removeEventListener('keydown',handleEscape);
          }
        };
        document.addEventListener('keydown',handleEscape);
      }
      
      function downloadJSON(results){
        var dataStr=JSON.stringify(results,null,2);
        var dataBlob=new Blob([dataStr],{type:'application/json'});
        var url=URL.createObjectURL(dataBlob);
        var link=document.createElement('a');
        link.href=url;
        link.download='accessibility-results.json';
        link.click();
        URL.revokeObjectURL(url);
      }
      
      function copyJSON(results){
        var dataStr=JSON.stringify(results,null,2);
        navigator.clipboard.writeText(dataStr).then(function(){
          alert('Results copied!');
        }).catch(function(){
          alert('Copy failed. Try downloading instead.');
        });
      }
    })();`;

    setBookmarkletCode(code);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(bookmarkletCode);
      alert('Bookmarklet code copied to clipboard!');
    } catch (err) {
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  // Generate the bookmarklet code on component mount
  useEffect(() => {
    generateBookmarklet();
  }, []);

  // Set the href when the component mounts and when bookmarkletCode changes
  useEffect(() => {
    if (anchorRef.current && bookmarkletCode) {
      anchorRef.current.href = bookmarkletCode;
    }
  }, [bookmarkletCode]);

  return (
    <>
      <Title className={classes.title} ta="center" mt={100}>
        Website{' '}
        <Text
          inherit
          variant="gradient"
          component="span"
          gradient={{ from: 'blue', to: 'green' }}
        >
          Accessibility Checker
        </Text>
      </Title>

      <div style={{ maxWidth: 800, margin: '20px auto', padding: '20px' }}>
        <Alert
          icon={<IconInfoCircle size="1rem" />}
          title="How to use this tool"
          color="blue"
          mb="xl"
        >
          This tool creates a bookmarklet that you can add to your browser's
          bookmarks bar. Right-click the button below and select "Bookmark
          Link..." to add it to your bookmarks. When clicked on any webpage, it
          will run an accessibility check using axe-core and display the results
          in an overlay with options to download or copy the results as JSON.
        </Alert>

        {bookmarkletCode && (
          <Stack gap="md" align="center">
            <Paper p="md" withBorder style={{ width: '100%' }}>
              <Stack gap="md" align="center">
                <a
                  ref={anchorRef}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="button"
                  tabIndex={0}
                  style={{
                    display: 'inline-block',
                    background: 'var(--mantine-color-blue-6)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease',
                    userSelect: 'none',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'var(--mantine-color-blue-7)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 8px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'var(--mantine-color-blue-6)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 4px rgba(0,0,0,0.1)';
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    // This prevents the default navigation but allows right-click context menu
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // This prevents the default navigation but allows right-click context menu
                    }
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                      marginRight: '8px',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                    }}
                  >
                    <path d="M18 7v14l-6 -4l-6 4v-14a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4z" />
                  </svg>
                  Accessibility Checker Bookmarklet
                </a>

                <Text size="sm" c="dimmed" ta="center" mb="md">
                  Right-click the button above and select "Bookmark Link..." to
                  add to your bookmarks bar
                </Text>
              </Stack>

              <Group justify="space-between" align="center" mb="xs">
                <Text size="sm" fw={500}>
                  Bookmarklet Code (for manual copying if needed):
                </Text>
                <Button
                  variant="light"
                  color="gray"
                  size="sm"
                  onClick={copyToClipboard}
                  leftSection={<IconCopy size="1rem" />}
                >
                  Copy Code
                </Button>
                <Button
                  variant="light"
                  color="gray"
                  size="sm"
                  onClick={() => setCodeExpanded(!codeExpanded)}
                  leftSection={
                    codeExpanded ? (
                      <IconChevronDown size="1rem" />
                    ) : (
                      <IconChevronRight size="1rem" />
                    )
                  }
                >
                  {codeExpanded ? 'Hide Code' : 'Show Code'}
                </Button>
              </Group>
              <Collapse in={codeExpanded}>
                <Code
                  block
                  style={{ wordBreak: 'break-all', fontSize: '12px' }}
                >
                  {bookmarkletCode}
                </Code>
              </Collapse>
            </Paper>
          </Stack>
        )}

        <Text c="dimmed" ta="center" size="sm" maw={580} mx="auto" mt="xl">
          After adding the bookmarklet to your bookmarks bar, click it on any
          webpage to check accessibility.
        </Text>
      </div>
    </>
  );
}
