# Google Analytics 4 Implementation Examples

## Basic Usage

### 1. Import the hook in your component
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

export default function MyComponent() {
  const { trackTool, trackButton, trackForm } = useAnalytics();
  
  // Your component logic
}
```

### 2. Track Tool Usage
```tsx
// When a user uses a tool
const handleToolUse = (toolName: string) => {
  // Your tool logic here
  
  // Track the tool usage
  trackTool('json-formatter', 'formatters');
};
```

### 3. Track Button Clicks
```tsx
// For navigation buttons
<Button onClick={() => {
  trackButton('view_all_tools', 'homepage');
  // Navigate to tools page
}}>
  View All Tools
</Button>

// For category buttons
<Button onClick={() => {
  trackButton('category_formatters', 'categories_section');
  // Navigate to formatters
}}>
  Formatters
</Button>
```

### 4. Track Form Submissions
```tsx
const handleSubmit = async (formData) => {
  try {
    const response = await submitForm(formData);
    
    if (response.ok) {
      trackForm('contact_form', true);
    } else {
      trackForm('contact_form', false);
    }
  } catch (error) {
    trackForm('contact_form', false);
  }
};
```

### 5. Track Search Queries
```tsx
const handleSearch = (query: string, results: any[]) => {
  trackSearchQuery(query, results.length);
};
```

### 6. Track Category Views
```tsx
const handleCategoryClick = (categoryName: string) => {
  trackCategory(categoryName);
  // Navigate to category
};
```

## Advanced Usage

### Custom Events
```tsx
import { trackEvent } from '@/lib/utils/analytics';

// Track custom events with detailed parameters
trackEvent('tool_copy_output', {
  tool_name: 'json-formatter',
  output_length: outputText.length,
  category: 'tool_interaction',
  success: true
});
```

### Tool-Specific Tracking
```tsx
// In a tool component
export default function JsonFormatterTool() {
  const { trackTool, trackUserInteraction } = useAnalytics();
  
  const handleFormat = () => {
    // Format JSON logic
    
    // Track tool usage
    trackTool('json-formatter', 'formatters');
  };
  
  const handleCopy = () => {
    // Copy logic
    
    // Track interaction
    trackUserInteraction('copy', 'json-formatter-output', {
      output_size: formattedJson.length
    });
  };
  
  const handleClear = () => {
    // Clear logic
    
    // Track interaction
    trackUserInteraction('clear', 'json-formatter-input');
  };
}
```

### External Link Tracking
```tsx
import { trackExternalLink } from '@/lib/utils/analytics';

<a 
  href="https://github.com/your-repo" 
  target="_blank"
  onClick={() => trackExternalLink('https://github.com/your-repo', 'GitHub Repository')}
>
  View on GitHub
</a>
```

## Events Being Tracked

### Automatic Events
- Page views (tracked automatically on route changes)
- Session start/end (handled by GA4)

### Custom Events
1. **tool_used** - When a user interacts with any tool
   - Parameters: tool_name, tool_category
   
2. **button_clicked** - When users click important buttons
   - Parameters: button_name, button_location
   
3. **form_submitted** - When forms are submitted
   - Parameters: form_name, form_success
   
4. **search** - When users search for tools
   - Parameters: search_term, search_results
   
5. **category_viewed** - When users view a category
   - Parameters: category_name
   
6. **interaction** - Generic user interactions
   - Parameters: interaction_type, interaction_name
   
7. **external_link_clicked** - When users click external links
   - Parameters: link_url, link_text

## Best Practices

1. **Don't over-track**: Only track meaningful user interactions
2. **Use consistent naming**: Follow the naming conventions established
3. **Include context**: Add relevant parameters to understand user behavior
4. **Test in development**: Events are logged to console in development mode
5. **Respect privacy**: Only track necessary data for improving user experience

## Debugging

In development mode, all events are logged to the console instead of being sent to GA4. Check the browser console to see:
```
GA4 Debug: tool_used {tool_name: "json-formatter", tool_category: "formatters", category: "tools"}
```