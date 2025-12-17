'use client';

import React, { useState } from 'react';
import ToolLayout from '@/components/common/ToolLayout';
import InputBox from '@/components/common/InputBox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import CollapsibleGuide from '@/components/common/CollapsibleGuide';

interface XmlNode {
  name: string;
  attributes: { [key: string]: string };
  children: XmlNode[];
  text?: string;
  type: 'element' | 'text' | 'comment';
}

interface XmlStats {
  elements: number;
  attributes: number;
  textNodes: number;
  comments: number;
  depth: number;
}

export default function XmlViewerTool() {
  const [input, setInput] = useState('');
  const [xmlTree, setXmlTree] = useState<XmlNode | null>(null);
  const [xmlStats, setXmlStats] = useState<XmlStats>({ elements: 0, attributes: 0, textNodes: 0, comments: 0, depth: 0 });
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');
  const [showAttributes, setShowAttributes] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const parseXml = (xmlString: string) => {
    if (!xmlString.trim()) {
      setXmlTree(null);
      setXmlStats({ elements: 0, attributes: 0, textNodes: 0, comments: 0, depth: 0 });
      setIsValid(false);
      setError('');
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        setIsValid(false);
        setError('Invalid XML: ' + parserError.textContent);
        setXmlTree(null);
        return;
      }

      const stats: XmlStats = { elements: 0, attributes: 0, textNodes: 0, comments: 0, depth: 0 };
      
      const parseNode = (node: Node, depth = 0): XmlNode | null => {
        stats.depth = Math.max(stats.depth, depth);

        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          stats.elements++;
          
          const attributes: { [key: string]: string } = {};
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
            stats.attributes++;
          }

          const children: XmlNode[] = [];
          for (let i = 0; i < node.childNodes.length; i++) {
            const childNode = parseNode(node.childNodes[i], depth + 1);
            if (childNode) {
              children.push(childNode);
            }
          }

          return {
            name: element.tagName,
            attributes,
            children,
            type: 'element'
          };
        } else if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) {
            stats.textNodes++;
            return {
              name: '#text',
              attributes: {},
              children: [],
              text,
              type: 'text'
            };
          }
        } else if (node.nodeType === Node.COMMENT_NODE) {
          stats.comments++;
          return {
            name: '#comment',
            attributes: {},
            children: [],
            text: node.textContent || '',
            type: 'comment'
          };
        }

        return null;
      };

      const rootNode = parseNode(xmlDoc.documentElement);
      
      setXmlTree(rootNode);
      setXmlStats(stats);
      setIsValid(true);
      setError('');
      
      // Auto-expand root node
      if (rootNode) {
        setExpandedNodes(new Set(['root']));
      }
    } catch (err) {
      setIsValid(false);
      setError('Error parsing XML: ' + (err instanceof Error ? err.message : 'Unknown error'));
      setXmlTree(null);
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    parseXml(value);
  };

  const handleExample = () => {
    const example = `<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <!-- This is a comment -->
  <book id="1" category="fiction" available="true">
    <title lang="en">The Great Gatsby</title>
    <author>
      <first-name>F. Scott</first-name>
      <last-name>Fitzgerald</last-name>
    </author>
    <price currency="USD">12.99</price>
    <publication-date>1925-04-10</publication-date>
    <description>A classic American novel set in the Jazz Age.</description>
  </book>
  <book id="2" category="science-fiction" available="false">
    <title lang="en">Dune</title>
    <author>
      <first-name>Frank</first-name>
      <last-name>Herbert</last-name>
    </author>
    <price currency="USD">15.99</price>
    <publication-date>1965-08-01</publication-date>
    <description>Epic science fiction novel about desert planet Arrakis.</description>
  </book>
  <metadata>
    <total-books>2</total-books>
    <last-updated>2025-12-11</last-updated>
  </metadata>
</bookstore>`;
    setInput(example);
    parseXml(example);
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderXmlNode = (node: XmlNode, depth = 0, nodeId = 'root'): React.JSX.Element => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(nodeId);
    const indent = depth * 20;

    if (node.type === 'text') {
      return (
        <div key={nodeId} style={{ marginLeft: indent }} className="py-1">
          <span className="text-blue-600 font-mono text-sm">"{node.text}"</span>
        </div>
      );
    }

    if (node.type === 'comment' && !showComments) {
      return <div key={nodeId}></div>;
    }

    if (node.type === 'comment') {
      return (
        <div key={nodeId} style={{ marginLeft: indent }} className="py-1">
          <span className="text-gray-500 font-mono text-sm">
            &lt;!-- {node.text} --&gt;
          </span>
        </div>
      );
    }

    return (
      <div key={nodeId} className="py-1">
        <div style={{ marginLeft: indent }} className="flex items-center gap-2">
          {hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => toggleNode(nodeId)}
            >
              {isExpanded ? (
                <IconChevronDown className="h-3 w-3" />
              ) : (
                <IconChevronRight className="h-3 w-3" />
              )}
            </Button>
          )}
          
          <span className="font-mono text-sm">
            <span className="text-purple-600">&lt;{node.name}</span>
            {showAttributes && Object.entries(node.attributes).map(([key, value]) => (
              <span key={key}>
                <span className="text-orange-600 ml-1">{key}</span>
                <span className="text-gray-600">=</span>
                <span className="text-green-600">"{value}"</span>
              </span>
            ))}
            <span className="text-purple-600">&gt;</span>
          </span>
        </div>

        {isExpanded && hasChildren && (
          <div>
            {node.children.map((child, index) => 
              renderXmlNode(child, depth + 1, `${nodeId}-${index}`)
            )}
          </div>
        )}

        {hasChildren && isExpanded && (
          <div style={{ marginLeft: indent }} className="font-mono text-sm">
            <span className="text-purple-600">&lt;/{node.name}&gt;</span>
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>XML Viewer Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showAttributes"
                  checked={showAttributes}
                  onCheckedChange={setShowAttributes}
                />
                <Label htmlFor="showAttributes">Show attributes</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showComments"
                  checked={showComments}
                  onCheckedChange={setShowComments}
                />
                <Label htmlFor="showComments">Show comments</Label>
              </div>
            </div>
          </div>

          {isValid && (
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary">Valid XML</Badge>
              <Badge variant="outline">{xmlStats.elements} elements</Badge>
              <Badge variant="outline">{xmlStats.attributes} attributes</Badge>
              <Badge variant="outline">{xmlStats.textNodes} text nodes</Badge>
              <Badge variant="outline">{xmlStats.comments} comments</Badge>
              <Badge variant="outline">Depth: {xmlStats.depth}</Badge>
            </div>
          )}

          {!isValid && error && (
            <div className="text-destructive text-sm">
              <Badge variant="destructive">Invalid XML</Badge>
              <p className="mt-2">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <ToolLayout>
        <InputBox
          title="XML Content"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your XML content here..."
          rows={15}
          example="Load example XML"
          onExample={handleExample}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">XML Tree Structure</h3>
          
          <Card>
            <CardContent className="p-4">
              {xmlTree ? (
                <div className="font-mono text-xs sm:text-sm max-h-64 sm:max-h-96 overflow-auto">
                  {renderXmlNode(xmlTree)}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <div className="text-4xl mb-4">🌳</div>
                  <p className="text-sm sm:text-base">Enter valid XML to see the tree structure</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ToolLayout>

      {/* Documentation */}
      <CollapsibleGuide title="XML Viewer Guide">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Features:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Interactive tree view of XML structure</li>
              <li>Expandable/collapsible nodes</li>
              <li>Syntax highlighting for elements, attributes, and text</li>
              <li>XML validation with error reporting</li>
              <li>Statistics about XML structure</li>
              <li>Toggle visibility of attributes and comments</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2">Color coding:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li><span className="text-purple-600">Purple:</span> Element tags</li>
              <li><span className="text-orange-600">Orange:</span> Attribute names</li>
              <li><span className="text-green-600">Green:</span> Attribute values</li>
              <li><span className="text-blue-600">Blue:</span> Text content</li>
              <li><span className="text-gray-500">Gray:</span> Comments</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Use cases:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Analyze XML document structure</li>
              <li>Debug XML parsing issues</li>
              <li>Understand complex XML hierarchies</li>
              <li>Validate XML syntax</li>
              <li>Explore API responses in XML format</li>
              <li>Learn XML structure and organization</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tips:</h4>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Click arrows to expand/collapse nodes</li>
              <li>Toggle attributes/comments for cleaner view</li>
              <li>Check statistics to understand XML complexity</li>
              <li>Scroll horizontally if content is wide</li>
            </ul>
          </div>
        </div>
      </CollapsibleGuide>
    </div>
  );
}